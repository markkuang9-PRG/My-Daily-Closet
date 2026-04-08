import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { auth, db, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { AppHeader } from './components/AppHeader';
import { AuthScreen } from './components/AuthScreen';
import { BottomNav } from './components/BottomNav';
import { useClothes } from './hooks/useClothes';
import { useWeather } from './hooks/useWeather';
import { requireAiClient } from './lib/gemini';
import { logAppError } from './lib/logger';
import { compressImage, validateUpload } from './lib/upload';
import type { AppTab, ClothingItem, GeneratedCopy, OutfitRecommendation } from './types';
import { ClosetView } from './views/ClosetView';
import { MarketView } from './views/MarketView';
import { StylistView } from './views/StylistView';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>('closet');
  const [isUploading, setIsUploading] = useState(false);
  const [isStyling, setIsStyling] = useState(false);
  const [outfitRecommendation, setOutfitRecommendation] = useState<OutfitRecommendation | null>(null);
  const [sellingItem, setSellingItem] = useState<ClothingItem | null>(null);
  const [generatedCopy, setGeneratedCopy] = useState<GeneratedCopy | null>(null);
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const currentPath = `/users/${user?.uid ?? 'anonymous'}/clothes`;

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const weather = useWeather(user?.uid);
  const clothes = useClothes(user, isAuthReady);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      logAppError(error, {
        operation: 'auth_login',
        path: '/auth/google',
      });
      if (error.code === 'auth/popup-blocked') {
        alert("Login popup was blocked by the browser. Please allow popups or open the app in a new tab.");
      } else if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
        alert("Login failed, please try again.");
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
      validateUpload(file);

      // 1. Compress image
      const base64String = await compressImage(file);
      if (base64String.length > 1_000_000) {
        throw new Error('Compressed image is still too large. Please use a smaller image.');
      }
      const base64Data = base64String.split(',')[1];

      // 2. Call Gemini to analyze the clothing
      const response = await requireAiClient().models.generateContent({
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
        logAppError(e, {
          operation: 'parse_clothing_analysis',
          path: currentPath,
          userId: user.uid,
        });
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
      logAppError(error, {
        operation: 'upload_clothing_item',
        path: currentPath,
        userId: user.uid,
        extra: {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        },
      });
      alert(error instanceof Error ? error.message : "Upload or analysis failed, please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const generateOutfit = async () => {
    if (clothes.length === 0) {
      alert("Your closet is empty! Please upload some clothes first.");
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
        - 'message': A warm, butler-style message explaining why this outfit works for the current weather (e.g., "Today is ${weather}, this dark cargo pants will keep you warm...").
        Do not include markdown formatting.
      `;
      const response = await requireAiClient().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      const cleanJsonStr = response.text?.replace(/```json/g, '').replace(/```/g, '').trim() || '{}';
      const result = JSON.parse(cleanJsonStr);
      setOutfitRecommendation(result);
    } catch (error) {
      logAppError(error, {
        operation: 'generate_outfit',
        path: currentPath,
        userId: user?.uid ?? null,
        extra: {
          clothesCount: clothes.length,
          weather,
        },
      });
      alert(error instanceof Error ? error.message : "Failed to generate outfit, please try again.");
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
      alert("Success! Updated the wear history for these items.");
      setOutfitRecommendation(null);
      setActiveTab('closet');
    } catch (error) {
      logAppError(error, {
        operation: 'confirm_outfit',
        path: currentPath,
        userId: user.uid,
        extra: {
          itemIds: outfitRecommendation.itemIds,
        },
      });
      alert("Failed to update wear history, please try again.");
    }
  };

  const generateSalesCopy = async (item: ClothingItem) => {
    setSellingItem(item);
    setIsGeneratingCopy(true);
    setGeneratedCopy(null);
    try {
      const prompt = `
        You are an expert second-hand clothing seller on Poshmark and eBay.
        Write an attractive sales listing for this item:
        - Category: ${item.category}
        - Color: ${item.color}
        - Style: ${item.style}
        - Season: ${item.season}
        
        Return ONLY a valid JSON object with:
        - 'title': A catchy, click-baity title (e.g., "Like New! Versatile Beige Casual Jacket...").
        - 'description': A detailed, persuasive description including styling tips and condition (assume gently used). Add relevant hashtags at the end.
        Do not include markdown formatting like \`\`\`json.
      `;
      const response = await requireAiClient().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      const cleanJsonStr = response.text?.replace(/```json/g, '').replace(/```/g, '').trim() || '{}';
      const result = JSON.parse(cleanJsonStr);
      setGeneratedCopy(result);
    } catch (error) {
      logAppError(error, {
        operation: 'generate_sales_copy',
        path: currentPath,
        userId: user?.uid ?? null,
        extra: {
          itemId: item.id,
        },
      });
      alert(error instanceof Error ? error.message : "Failed to generate copy, please try again.");
      setSellingItem(null);
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!user) return;
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'clothes', id));
        if (sellingItem?.id === id) {
          setSellingItem(null);
          setGeneratedCopy(null);
        }
      } catch (error) {
        logAppError(error, {
          operation: 'delete_clothing_item',
          path: currentPath,
          userId: user.uid,
          extra: {
            itemId: id,
          },
        });
      }
    }
  };

  if (!isAuthReady) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  if (!user) {
    return <AuthScreen isLoggingIn={isLoggingIn} onLogin={handleLogin} />;
  }

  // Calculate idle clothes (not worn in 90 days)
  const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;
  const idleClothes = clothes.filter(c => (Date.now() - c.lastWorn) > NINETY_DAYS_MS);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center font-sans text-gray-900">
      {/* Mobile Container */}
      <div className="w-full max-w-md bg-white h-screen flex flex-col shadow-2xl relative overflow-hidden">
        <AppHeader
          activeTab={activeTab}
          clothesCount={clothes.length}
          idleClothesCount={idleClothes.length}
          weather={weather}
          onLogout={() => signOut(auth)}
        />

        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-4 pb-24">
          <AnimatePresence mode="wait">
            {activeTab === 'closet' && (
              <ClosetView
                clothes={clothes}
                fileInputRef={fileInputRef}
                isUploading={isUploading}
                onFileUpload={handleFileUpload}
                onDeleteItem={deleteItem}
              />
            )}

            {activeTab === 'stylist' && (
              <StylistView
                clothes={clothes}
                isStyling={isStyling}
                outfitRecommendation={outfitRecommendation}
                onGenerateOutfit={generateOutfit}
                onConfirmOutfit={confirmOutfit}
              />
            )}

            {activeTab === 'market' && (
              <MarketView
                idleClothes={idleClothes}
                sellingItem={sellingItem}
                generatedCopy={generatedCopy}
                isGeneratingCopy={isGeneratingCopy}
                onGenerateSalesCopy={generateSalesCopy}
                onClearSellingItem={() => {
                  setSellingItem(null);
                  setGeneratedCopy(null);
                }}
                onCopyGeneratedCopy={(itemId, copy) => {
                  navigator.clipboard.writeText(`${copy.title}\n\n${copy.description}`);
                  alert("Copy copied to clipboard! You can paste it directly to Poshmark or eBay.");
                  deleteItem(itemId);
                }}
              />
            )}
          </AnimatePresence>
        </main>

        <BottomNav activeTab={activeTab} idleClothesCount={idleClothes.length} onTabChange={setActiveTab} />

      </div>
    </div>
  );
}
