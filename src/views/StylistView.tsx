import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { ClothingCard } from '../components/ClothingCard';
import type { ClothingItem, OutfitRecommendation, WeatherState } from '../types';

type StylistViewProps = {
  clothes: ClothingItem[];
  isGeminiConfigured: boolean;
  isStyling: boolean;
  occasion: string;
  outfitRecommendation: OutfitRecommendation | null;
  weather: WeatherState;
  onGenerateOutfit: () => void;
  onOccasionChange: (value: string) => void;
  onConfirmOutfit: () => void;
};

const occasionPresets = ['Office', 'Date night', 'Travel', 'Weekend'];

export const StylistView = ({
  clothes,
  isGeminiConfigured,
  isStyling,
  occasion,
  outfitRecommendation,
  weather,
  onGenerateOutfit,
  onOccasionChange,
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
          <div className="rounded-2xl bg-white px-4 py-3 text-left shadow-sm ring-1 ring-gray-100 max-w-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Weather input</p>
            <p className="mt-1 text-sm font-medium text-gray-800">{weather.summary}</p>
            <p className="mt-1 text-xs text-gray-500">{weather.detail}</p>
          </div>
          <div className="w-full max-w-sm rounded-2xl bg-white px-4 py-4 text-left shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Optional occasion</p>
              {occasion ? (
                <button
                  type="button"
                  onClick={() => onOccasionChange('')}
                  className="text-xs font-medium text-gray-500 hover:text-black"
                >
                  Clear
                </button>
              ) : null}
            </div>
            <input
              value={occasion}
              onChange={(event) => onOccasionChange(event.target.value)}
              placeholder="Office meeting, dinner, travel day..."
              className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-black"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {occasionPresets.map((preset) => {
                const isActive = occasion === preset;

                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => onOccasionChange(isActive ? '' : preset)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      isActive ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>
          </div>
          <button
            onClick={onGenerateOutfit}
            disabled={isStyling || clothes.length === 0 || !isGeminiConfigured}
            className="bg-black text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-gray-800 disabled:bg-gray-300 transition-colors mt-6"
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
          {!isGeminiConfigured ? (
            <p className="text-xs text-amber-700 mt-3">Set the Gemini environment variable before testing AI outfit recommendations.</p>
          ) : null}
          {clothes.length === 0 ? <p className="text-xs text-red-400 mt-3">Please add items to your closet first</p> : null}
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative mb-8 mt-4">
            <div className="absolute -top-4 -left-2 text-3xl">💬</div>
            {occasion ? (
              <div className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                Occasion: {occasion}
              </div>
            ) : null}
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
                disabled={isStyling || !isGeminiConfigured}
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
