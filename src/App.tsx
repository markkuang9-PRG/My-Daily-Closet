import React, { useState, useRef, useEffect } from 'react';
import { Camera, Plus, Shirt, Sparkles, Store, Loader2, Tag, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import { auth, db, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Types
interface ClothingItem {
  id: string;
  imageUrl: string;
  category: string;
  color: string;
  style: string;
  season: string;
  lastWorn: number;
  createdAt: number;
}

// Helper: Compress image to fit within Firestore 1MB limit
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500;
        let width = img.width;
        let height = img.height;
        
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.6)); // Compress to JPEG 60%
      };
      img.onerror = (error) => reject(error);
    };
  });
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [activeTab, setActiveTab] = useState<'closet' | 'stylist' | 'market'>('closet');
  const [clothes, setClothes] = useState<ClothingItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Stylist State
  const [isStyling, setIsStyling] = useState(false);
  const [outfitRecommendation, setOutfitRecommendation] = useState<{ message: string; itemIds: string[] } | null>(null);
  const [weather, setWeather] = useState<string>("获取天气中...");
  
  // Market State
  const [sellingItem, setSellingItem] = useState<ClothingItem | null>(null);
  const [generatedCopy, setGeneratedCopy] = useState<{ title: string; description: string } | null>(null);
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Weather
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
          const data = await res.json();
          // Map WMO weather codes to simple strings
          const code = data.current_weather.weathercode;
          let condition = "晴朗";
          if (code >= 51 && code <= 67) condition = "下雨";
          if (code >= 71 && code <= 77) condition = "下雪";
          if (code >= 1 && code <= 3) condition = "多云";
          setWeather(`${data.current_weather.temperature}°C, ${condition}`);
        } catch (e) {
          console.error("Weather fetch error", e);
          setWeather("20°C, 晴朗 (默认)");
        }
      }, () => {
        setWeather("20°C, 晴朗 (默认)");
      });
    } else {
      setWeather("20°C, 晴朗 (默认)");
    }
  }, []);

  // Firestore Sync
  useEffect(() => {
    if (!user || !isAuthReady) return;
    
    const q = query(collection(db, 'users', user.uid, 'clothes'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: ClothingItem[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as ClothingItem);
      });
      setClothes(items);
    }, (error) => {
      console.error("Firestore sync error", error);
    });
    
    return () => unsubscribe();
  }, [user, isAuthReady]);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Login failed", error);
      if (error.code === 'auth/popup-blocked') {
        alert("登录弹窗被浏览器拦截。请点击浏览器地址栏的拦截提示允许弹窗，或者点击预览窗口右上角的图标【在新标签页中打开】应用。");
      } else if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
        alert("登录失败，请重试。");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);

    try {
      // 1. Compress image
      const base64String = await compressImage(file);
      const base64Data = base64String.split(',')[1];

      // 2. Call Gemini to analyze the clothing
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
          "Analyze this clothing item. Return ONLY a valid JSON object with these exact keys: 'category' (Top, Bottom, Shoes, Outerwear, Dress, Accessory), 'color', 'style' (Casual, Formal, Sport, Vintage, etc.), 'season' (Spring, Summer, Autumn, Winter, All). Do not include any markdown formatting like ```json."
        ]
      });

      // 3. Parse result
      let aiResult;
      try {
        const cleanJsonStr = response.text?.replace(/```json/g, '').replace(/```/g, '').trim() || '{}';
        aiResult = JSON.parse(cleanJsonStr);
      } catch (e) {
        console.error("Failed to parse AI response", e);
        aiResult = { category: 'Unknown', color: 'Unknown', style: 'Unknown', season: 'Unknown' };
      }

      // 4. Save to Firestore
      await addDoc(collection(db, 'users', user.uid, 'clothes'), {
        imageUrl: base64String,
        category: aiResult.category || 'Unknown',
        color: aiResult.color || 'Unknown',
        style: aiResult.style || 'Unknown',
        season: aiResult.season || 'Unknown',
        lastWorn: Date.now(),
        createdAt: Date.now()
      });

    } catch (error) {
      console.error("Upload error:", error);
      alert("上传或分析失败，请重试。");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const generateOutfit = async () => {
    if (clothes.length === 0) {
      alert("您的衣橱还是空的！请先上传一些衣服。");
      return;
    }
    setIsStyling(true);
    try {
      // Create a lightweight version of clothes for the prompt to save tokens
      const wardrobeContext = clothes.map(c => ({ id: c.id, category: c.category, color: c.color, style: c.style, season: c.season }));
      
      const prompt = `
        You are an AI fashion stylist.
        User Wardrobe: ${JSON.stringify(wardrobeContext)}
        Weather: ${weather}
        Rules: Create a stylish outfit using the available items. Try to include a Top and a Bottom, or a Dress. Add Outerwear if suitable for the weather.
        Return ONLY a valid JSON object with:
        - 'itemIds': an array of the 'id' strings of the selected items.
        - 'message': A warm, butler-style message in Chinese explaining why this outfit works for the current weather (e.g., "今天${weather}，这件深色工装裤很保暖...").
        Do not include markdown formatting.
      `;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      const cleanJsonStr = response.text?.replace(/```json/g, '').replace(/```/g, '').trim() || '{}';
      const result = JSON.parse(cleanJsonStr);
      setOutfitRecommendation(result);
    } catch (error) {
      console.error(error);
      alert("生成搭配失败，请重试。");
    } finally {
      setIsStyling(false);
    }
  };

  const confirmOutfit = async () => {
    if (!user || !outfitRecommendation) return;
    
    try {
      const now = Date.now();
      // Update lastWorn for all selected items
      await Promise.all(outfitRecommendation.itemIds.map(id => 
        updateDoc(doc(db, 'users', user.uid, 'clothes', id), { lastWorn: now })
      ));
      alert("打卡成功！已更新这些衣物的穿着记录。");
      setOutfitRecommendation(null);
      setActiveTab('closet');
    } catch (error) {
      console.error("Failed to update outfit", error);
      alert("打卡失败，请重试。");
    }
  };

  const generateSalesCopy = async (item: ClothingItem) => {
    setSellingItem(item);
    setIsGeneratingCopy(true);
    setGeneratedCopy(null);
    try {
      const prompt = `
        You are an expert second-hand clothing seller on Poshmark and Idle Fish (闲鱼).
        Write an attractive sales listing in Chinese for this item:
        - Category: ${item.category}
        - Color: ${item.color}
        - Style: ${item.style}
        - Season: ${item.season}
        
        Return ONLY a valid JSON object with:
        - 'title': A catchy, click-baity title (e.g., "9新捡漏！超百搭米色休闲外套...").
        - 'description': A detailed, persuasive description including styling tips and condition (assume gently used). Add relevant hashtags at the end.
        Do not include markdown formatting like \`\`\`json.
      `;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      const cleanJsonStr = response.text?.replace(/```json/g, '').replace(/```/g, '').trim() || '{}';
      const result = JSON.parse(cleanJsonStr);
      setGeneratedCopy(result);
    } catch (error) {
      console.error(error);
      alert("生成文案失败，请重试。");
      setSellingItem(null);
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!user) return;
    if (window.confirm("确定要删除这件衣物吗？")) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'clothes', id));
        if (sellingItem?.id === id) {
          setSellingItem(null);
          setGeneratedCopy(null);
        }
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  };

  if (!isAuthReady) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center font-sans text-gray-900">
        <div className="w-full max-w-md bg-white h-screen flex flex-col items-center justify-center p-8 shadow-2xl">
          <div className="w-20 h-20 bg-black text-white rounded-3xl flex items-center justify-center mb-6 shadow-lg">
            <Shirt className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold mb-2">My Daily Closet</h1>
          <p className="text-gray-500 text-center mb-10">您的智能衣橱管家<br/>让衣物从“堆积”变成“资产”</p>
          <button 
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full bg-black text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:bg-gray-600"
          >
            {isLoggingIn ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> 正在打开登录窗口...</>
            ) : (
              <><LogIn className="w-5 h-5" /> 使用 Google 账号登录</>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Calculate idle clothes (not worn in 90 days)
  const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;
  const idleClothes = clothes.filter(c => (Date.now() - c.lastWorn) > NINETY_DAYS_MS);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center font-sans text-gray-900">
      {/* Mobile Container */}
      <div className="w-full max-w-md bg-white h-screen flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <header className="pt-12 pb-4 px-6 bg-white border-b border-gray-100 z-10 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {activeTab === 'closet' && '我的衣橱'}
              {activeTab === 'stylist' && 'AI 造型师'}
              {activeTab === 'market' && '闲置流转'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {activeTab === 'closet' && `共 ${clothes.length} 件单品`}
              {activeTab === 'stylist' && `当前天气: ${weather}`}
              {activeTab === 'market' && `发现 ${idleClothes.length} 件闲置衣物`}
            </p>
          </div>
          <button onClick={() => signOut(auth)} className="text-gray-400 hover:text-red-500 p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-4 pb-24">
          <AnimatePresence mode="wait">
            {activeTab === 'closet' && (
              <motion.div
                key="closet"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Upload Button */}
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full bg-black text-white rounded-2xl p-4 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:bg-gray-400 shadow-sm"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>AI 识别入库中...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5" />
                      <span className="font-medium">拍照 / 上传新衣物</span>
                    </>
                  )}
                </button>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />

                {/* Clothes Grid */}
                {clothes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-center">
                    <Shirt className="w-12 h-12 mb-3 opacity-20" />
                    <p>您的衣橱空空如也</p>
                    <p className="text-sm mt-1">点击上方按钮添加第一件单品吧！</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {clothes.map(item => {
                      const daysSinceWorn = Math.floor((Date.now() - item.lastWorn) / (1000 * 60 * 60 * 24));
                      return (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          key={item.id} 
                          className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group relative"
                        >
                          <button 
                            onClick={() => deleteItem(item.id)}
                            className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 text-xs"
                          >
                            ✕
                          </button>
                          <div className="aspect-[4/5] relative bg-gray-100 overflow-hidden">
                            <img 
                              src={item.imageUrl} 
                              alt={item.category}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            {daysSinceWorn > 90 && (
                              <div className="absolute bottom-0 left-0 w-full bg-red-500/80 text-white text-[10px] py-1 text-center font-medium backdrop-blur-sm">
                                闲置 {daysSinceWorn} 天
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-sm">{item.category}</span>
                              <span className="text-[10px] px-2 py-1 bg-gray-100 rounded-full text-gray-600">{item.season}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Tag className="w-3 h-3" />
                              <span className="truncate">{item.color} • {item.style}</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'stylist' && (
              <motion.div
                key="stylist"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {!outfitRecommendation ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">AI 造型师</h2>
                    <p className="text-gray-500 text-sm mb-6 px-4">
                      根据您衣橱中的单品和今日真实天气，为您量身定制穿搭方案。
                    </p>
                    <button 
                      onClick={generateOutfit}
                      disabled={isStyling || clothes.length === 0}
                      className="bg-black text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-gray-800 disabled:bg-gray-300 transition-colors"
                    >
                      {isStyling ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> 生成中...</>
                      ) : (
                        <><Sparkles className="w-5 h-5" /> 一键生成今日穿搭</>
                      )}
                    </button>
                    {clothes.length === 0 && (
                      <p className="text-xs text-red-400 mt-3">请先在衣橱中添加衣物</p>
                    )}
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Butler Message */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative mb-8 mt-4">
                      <div className="absolute -top-4 -left-2 text-3xl">💬</div>
                      <p className="text-gray-700 leading-relaxed font-medium">
                        {outfitRecommendation.message}
                      </p>
                      <div className="flex gap-3 mt-5">
                        <button 
                          onClick={confirmOutfit}
                          className="flex-1 bg-black text-white py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-1 hover:bg-gray-800"
                        >
                          <CheckCircle2 className="w-4 h-4" /> 就穿这套 (打卡)
                        </button>
                        <button 
                          onClick={generateOutfit}
                          disabled={isStyling}
                          className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200"
                        >
                          换一套
                        </button>
                      </div>
                    </div>

                    {/* Selected Items */}
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">今日推荐单品</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {clothes.filter(c => outfitRecommendation.itemIds.includes(c.id)).map(item => (
                        <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                          <div className="aspect-[4/5] relative bg-gray-100">
                            <img 
                              src={item.imageUrl} 
                              alt={item.category}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="p-3">
                            <span className="font-semibold text-sm block truncate">{item.category}</span>
                            <span className="text-xs text-gray-500">{item.color}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'market' && (
              <motion.div
                key="market"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {idleClothes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-center">
                    <Store className="w-12 h-12 mb-3 opacity-20" />
                    <p>太棒了！</p>
                    <p className="text-sm mt-1">您的衣橱目前没有超过 90 天未穿的闲置衣物。</p>
                  </div>
                ) : !sellingItem ? (
                  <div className="animate-in fade-in">
                    <div className="bg-red-50 text-red-800 p-4 rounded-2xl mb-6 text-sm">
                      <p className="font-medium flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-red-500" /> 闲置预警
                      </p>
                      <p className="mt-1 opacity-80">系统检测到以下衣物您已经超过 90 天没有穿过了。让 AI 为您一键生成高转化率的二手售卖文案，让闲置变现吧！</p>
                    </div>
                    
                    <div className="space-y-4">
                      {idleClothes.map(item => {
                        const daysSinceWorn = Math.floor((Date.now() - item.lastWorn) / (1000 * 60 * 60 * 24));
                        return (
                          <div key={item.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
                            <img src={item.imageUrl} alt={item.category} className="w-20 h-24 object-cover rounded-xl" referrerPolicy="no-referrer" />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h4 className="font-semibold text-gray-900">{item.color} {item.category}</h4>
                                <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">闲置 {daysSinceWorn} 天</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{item.style} • {item.season}</p>
                              <button 
                                onClick={() => generateSalesCopy(item)}
                                className="mt-3 text-xs font-medium bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
                              >
                                一键变现
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="animate-in slide-in-from-right-4 duration-300">
                    <button 
                      onClick={() => { setSellingItem(null); setGeneratedCopy(null); }}
                      className="text-sm text-gray-500 mb-4 flex items-center gap-1 hover:text-black"
                    >
                      ← 返回列表
                    </button>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <img src={sellingItem.imageUrl} alt="Selling item" className="w-full h-48 object-cover" referrerPolicy="no-referrer" />
                      
                      <div className="p-5">
                        {isGeneratingCopy ? (
                          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                            <Loader2 className="w-8 h-8 animate-spin mb-3 text-green-500" />
                            <p className="text-sm font-medium">AI 正在撰写爆款文案...</p>
                          </div>
                        ) : generatedCopy ? (
                          <div className="space-y-4">
                            <div>
                              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">商品标题</label>
                              <h3 className="text-lg font-bold text-gray-900 mt-1">{generatedCopy.title}</h3>
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">商品描述</label>
                              <div className="bg-gray-50 p-4 rounded-xl mt-1 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {generatedCopy.description}
                              </div>
                            </div>
                            
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(`${generatedCopy.title}\n\n${generatedCopy.description}`);
                                alert("文案已复制！您可以直接粘贴到闲鱼或 Poshmark。");
                                deleteItem(sellingItem.id); // Optional: Ask if they want to remove it from closet
                              }}
                              className="w-full bg-green-500 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-green-600 transition-colors mt-4"
                            >
                              <Store className="w-4 h-4" /> 复制文案并去发布
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 w-full bg-white border-t border-gray-100 px-6 py-4 pb-8 flex justify-between items-center z-20">
          <button 
            onClick={() => setActiveTab('closet')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'closet' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Shirt className="w-6 h-6" />
            <span className="text-[10px] font-medium">衣橱</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('stylist')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'stylist' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-[10px] font-medium">造型师</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('market')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'market' ? 'text-black' : 'text-gray-400 hover:text-gray-600 relative'}`}
          >
            <div className="relative">
              <Store className="w-6 h-6" />
              {idleClothes.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </div>
            <span className="text-[10px] font-medium">流转</span>
          </button>
        </nav>

      </div>
    </div>
  );
}
