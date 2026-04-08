import { Shirt, Sparkles, Store } from 'lucide-react';
import type { AppTab } from '../types';

type BottomNavProps = {
  activeTab: AppTab;
  idleClothesCount: number;
  onTabChange: (tab: AppTab) => void;
};

const navItems: Array<{ tab: AppTab; label: string; icon: typeof Shirt }> = [
  { tab: 'closet', label: 'Closet', icon: Shirt },
  { tab: 'stylist', label: 'Stylist', icon: Sparkles },
  { tab: 'market', label: 'Market', icon: Store },
];

export const BottomNav = ({ activeTab, idleClothesCount, onTabChange }: BottomNavProps) => {
  return (
    <nav className="absolute bottom-0 w-full bg-white border-t border-gray-100 px-6 py-4 pb-8 flex justify-between items-center z-20">
      {navItems.map(({ tab, label, icon: Icon }) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === tab ? 'text-black' : 'text-gray-400 hover:text-gray-600'
          } ${tab === 'market' ? 'relative' : ''}`}
        >
          <div className="relative">
            <Icon className="w-6 h-6" />
            {tab === 'market' && idleClothesCount > 0 ? (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            ) : null}
          </div>
          <span className="text-[10px] font-medium">{label}</span>
        </button>
      ))}
    </nav>
  );
};
