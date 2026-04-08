import { LogOut } from 'lucide-react';
import type { AppTab } from '../types';

type AppHeaderProps = {
  activeTab: AppTab;
  clothesCount: number;
  idleClothesCount: number;
  weather: string;
  onLogout: () => void;
};

const titles: Record<AppTab, string> = {
  closet: 'My Closet',
  stylist: 'AI Stylist',
  market: 'Marketplace',
};

const subtitles = (tab: AppTab, clothesCount: number, idleClothesCount: number, weather: string) => {
  if (tab === 'closet') return `${clothesCount} items total`;
  if (tab === 'stylist') return `Current Weather: ${weather}`;
  return `Found ${idleClothesCount} idle items`;
};

export const AppHeader = ({
  activeTab,
  clothesCount,
  idleClothesCount,
  weather,
  onLogout,
}: AppHeaderProps) => {
  return (
    <header className="pt-12 pb-4 px-6 bg-white border-b border-gray-100 z-10 flex justify-between items-end">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{titles[activeTab]}</h1>
        <p className="text-sm text-gray-500 mt-1">{subtitles(activeTab, clothesCount, idleClothesCount, weather)}</p>
      </div>
      <button onClick={onLogout} className="text-gray-400 hover:text-red-500 p-2">
        <LogOut className="w-5 h-5" />
      </button>
    </header>
  );
};
