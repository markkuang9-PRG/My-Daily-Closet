import { motion } from 'motion/react';
import { Tag } from 'lucide-react';
import type { ClothingItem } from '../types';

type ClothingCardProps = {
  item: ClothingItem;
  variant?: 'closet' | 'compact';
  idleLabel?: string | null;
  onDelete?: (id: string) => void;
};

export const ClothingCard = ({ item, variant = 'closet', idleLabel, onDelete }: ClothingCardProps) => {
  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <div className="aspect-[4/5] relative bg-gray-100">
          <img src={item.imageUrl} alt={item.category} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="p-3">
          <span className="font-semibold text-sm block truncate">{item.category}</span>
          <span className="text-xs text-gray-500">{item.color}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group relative"
    >
      {onDelete ? (
        <button
          onClick={() => onDelete(item.id)}
          className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 text-xs"
        >
          ✕
        </button>
      ) : null}
      <div className="aspect-[4/5] relative bg-gray-100 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.category}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {idleLabel ? (
          <div className="absolute bottom-0 left-0 w-full bg-red-500/80 text-white text-[10px] py-1 text-center font-medium backdrop-blur-sm">
            {idleLabel}
          </div>
        ) : null}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-sm">{item.category}</span>
          <span className="text-[10px] px-2 py-1 bg-gray-100 rounded-full text-gray-600">{item.season}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Tag className="w-3 h-3" />
          <span className="truncate">
            {item.color} • {item.style}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
