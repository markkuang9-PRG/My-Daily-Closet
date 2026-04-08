import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { auth, db, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { AppHeader } from './components/AppHeader';
import { AuthScreen } from './components/AuthScreen';
import { BottomNav } from './components/BottomNav';
import { useClosetActions } from './hooks/useClosetActions';
import { useClothes } from './hooks/useClothes';
import { useWeather } from './hooks/useWeather';
import { logAppError } from './lib/logger';
import type { AppTab } from './types';
import { ClosetView } from './views/ClosetView';
import { MarketView } from './views/MarketView';
import { StylistView } from './views/StylistView';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>('closet');
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
  const {
    clearSellingItem,
    confirmOutfit,
    copyGeneratedCopy,
    deleteItem,
    fileInputRef,
    generateOutfit,
    generateSalesCopy,
    generatedCopy,
    handleFileUpload,
    isGeneratingCopy,
    isStyling,
    isUploading,
    outfitRecommendation,
    sellingItem,
  } = useClosetActions({
    clothes,
    currentPath,
    user,
    weather,
  });

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
                onConfirmOutfit={async () => {
                  const didConfirm = await confirmOutfit();
                  if (didConfirm) {
                    setActiveTab('closet');
                  }
                }}
              />
            )}

            {activeTab === 'market' && (
              <MarketView
                idleClothes={idleClothes}
                sellingItem={sellingItem}
                generatedCopy={generatedCopy}
                isGeneratingCopy={isGeneratingCopy}
                onGenerateSalesCopy={generateSalesCopy}
                onClearSellingItem={clearSellingItem}
                onCopyGeneratedCopy={copyGeneratedCopy}
              />
            )}
          </AnimatePresence>
        </main>

        <BottomNav activeTab={activeTab} idleClothesCount={idleClothes.length} onTabChange={setActiveTab} />

      </div>
    </div>
  );
}
