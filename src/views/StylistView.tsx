import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { ClothingCard } from '../components/ClothingCard';
import type { ClothingItem, OutfitRecommendation } from '../types';

type StylistViewProps = {
  clothes: ClothingItem[];
  isStyling: boolean;
  outfitRecommendation: OutfitRecommendation | null;
  onGenerateOutfit: () => void;
  onConfirmOutfit: () => void;
};

export const StylistView = ({
  clothes,
  isStyling,
  outfitRecommendation,
  onGenerateOutfit,
  onConfirmOutfit,
}: StylistViewProps) => {
  const recommendedItems = outfitRecommendation
    ? clothes.filter((item) => outfitRecommendation.itemIds.includes(item.id))
    : [];

  return (
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
          <h2 className="text-lg font-semibold text-gray-900 mb-2">AI Stylist</h2>
          <p className="text-gray-500 text-sm mb-6 px-4">
            Tailored outfit recommendations based on your closet and today&apos;s weather.
          </p>
          <button
            onClick={onGenerateOutfit}
            disabled={isStyling || clothes.length === 0}
            className="bg-black text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-gray-800 disabled:bg-gray-300 transition-colors"
          >
            {isStyling ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" /> Generate Today&apos;s Outfit
              </>
            )}
          </button>
          {clothes.length === 0 ? <p className="text-xs text-red-400 mt-3">Please add items to your closet first</p> : null}
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative mb-8 mt-4">
            <div className="absolute -top-4 -left-2 text-3xl">💬</div>
            <p className="text-gray-700 leading-relaxed font-medium">{outfitRecommendation.message}</p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={onConfirmOutfit}
                className="flex-1 bg-black text-white py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-1 hover:bg-gray-800"
              >
                <CheckCircle2 className="w-4 h-4" /> Wear This (Log)
              </button>
              <button
                onClick={onGenerateOutfit}
                disabled={isStyling}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200"
              >
                Try Another
              </button>
            </div>
          </div>

          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Today&apos;s Recommendation</h3>
          <div className="grid grid-cols-2 gap-4">
            {recommendedItems.map((item) => (
              <div key={item.id}>
                <ClothingCard item={item} variant="compact" />
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
