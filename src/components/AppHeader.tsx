import { LogOut } from 'lucide-react';
import type { AppTab, WeatherState } from '../types';

type AppHeaderProps = {
  activeTab: AppTab;
  clothesCount: number;
  isGeminiConfigured: boolean;
  idleClothesCount: number;
  weather: WeatherState;
  onLogout: () => void;
};

const titles: Record<AppTab, string> = {
  closet: 'My Closet',
  stylist: 'AI Stylist',
  market: 'Marketplace',
};

const subtitles = (tab: AppTab, clothesCount: number, idleClothesCount: number, weather: WeatherState) => {
  if (tab === 'closet') return `${clothesCount} items total`;
  if (tab === 'stylist') {
    if (weather.source === 'loading') return weather.detail;
    if (weather.source === 'fallback') return `${weather.summary} • fallback`;
    return `Current weather: ${weather.summary}`;
  }
  return `Found ${idleClothesCount} idle items`;
};

export const AppHeader = ({
  activeTab,
  clothesCount,
  isGeminiConfigured,
  idleClothesCount,
  weather,
  onLogout,
}: AppHeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-100 z-10">
      <div className="pt-12 pb-4 px-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{titles[activeTab]}</h1>
          <p className="text-sm text-gray-500 mt-1">{subtitles(activeTab, clothesCount, idleClothesCount, weather)}</p>
        </div>
        <button onClick={onLogout} className="text-gray-400 hover:text-red-500 p-2">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
      {!isGeminiConfigured ? (
        <div className="mx-6 mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          AI features are currently disabled until the Gemini environment variable is configured.
        </div>
      ) : null}
    </header>
  );
};
