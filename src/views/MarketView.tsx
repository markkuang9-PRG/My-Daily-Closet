import { Loader2, Sparkles, Store } from 'lucide-react';
import { motion } from 'motion/react';
import type { ClothingItem, GeneratedCopy } from '../types';

type MarketViewProps = {
  idleClothes: ClothingItem[];
  sellingItem: ClothingItem | null;
  generatedCopy: GeneratedCopy | null;
  isGeneratingCopy: boolean;
  onGenerateSalesCopy: (item: ClothingItem) => void;
  onClearSellingItem: () => void;
  onCopyGeneratedCopy: (itemId: string, generatedCopy: GeneratedCopy) => void;
};

export const MarketView = ({
  idleClothes,
  sellingItem,
  generatedCopy,
  isGeneratingCopy,
  onGenerateSalesCopy,
  onClearSellingItem,
  onCopyGeneratedCopy,
}: MarketViewProps) => {
  return (
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
          <p>Awesome!</p>
          <p className="text-sm mt-1">You have no items idle for over 90 days.</p>
        </div>
      ) : !sellingItem ? (
        <div className="animate-in fade-in">
          <div className="bg-red-50 text-red-800 p-4 rounded-2xl mb-6 text-sm">
            <p className="font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-500" /> Idle Alert
            </p>
            <p className="mt-1 opacity-80">
              The system detected the following items haven&apos;t been worn in over 90 days. Let AI generate
              high-converting sales copy to turn them into cash!
            </p>
          </div>

          <div className="space-y-4">
            {idleClothes.map((item) => {
              const daysSinceWorn = Math.floor((Date.now() - item.lastWorn) / (1000 * 60 * 60 * 24));
              return (
                <div key={item.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
                  <img src={item.imageUrl} alt={item.category} className="w-20 h-24 object-cover rounded-xl" referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-gray-900">
                        {item.color} {item.category}
                      </h4>
                      <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                        Idle {daysSinceWorn} days
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.style} • {item.season}
                    </p>
                    <button
                      onClick={() => onGenerateSalesCopy(item)}
                      className="mt-3 text-xs font-medium bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
                    >
                      Sell Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="animate-in slide-in-from-right-4 duration-300">
          <button onClick={onClearSellingItem} className="text-sm text-gray-500 mb-4 flex items-center gap-1 hover:text-black">
            ← Back to list
          </button>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <img src={sellingItem.imageUrl} alt="Selling item" className="w-full h-48 object-cover" referrerPolicy="no-referrer" />

            <div className="p-5">
              {isGeneratingCopy ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                  <Loader2 className="w-8 h-8 animate-spin mb-3 text-green-500" />
                  <p className="text-sm font-medium">AI is writing sales copy...</p>
                </div>
              ) : generatedCopy ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Listing Title</label>
                    <h3 className="text-lg font-bold text-gray-900 mt-1">{generatedCopy.title}</h3>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Listing Description</label>
                    <div className="bg-gray-50 p-4 rounded-xl mt-1 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {generatedCopy.description}
                    </div>
                  </div>

                  <button
                    onClick={() => onCopyGeneratedCopy(sellingItem.id, generatedCopy)}
                    className="w-full bg-green-500 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-green-600 transition-colors mt-4"
                  >
                    <Store className="w-4 h-4" /> Copy & Go to Sell
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
