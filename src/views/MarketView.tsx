import { useEffect, useState } from 'react';
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
  const [draftCopy, setDraftCopy] = useState<GeneratedCopy | null>(null);

  useEffect(() => {
    setDraftCopy(generatedCopy);
  }, [generatedCopy, sellingItem]);

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
                  <img
                    src={item.imageUrl}
                    alt={item.category}
                    className="w-20 h-24 object-cover rounded-xl"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                  />
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
            <img
              src={sellingItem.imageUrl}
              alt="Selling item"
              className="w-full h-48 object-cover"
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
            />

            <div className="p-5">
              {isGeneratingCopy ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                  <Loader2 className="w-8 h-8 animate-spin mb-3 text-green-500" />
                  <p className="text-sm font-medium">AI is writing sales copy...</p>
                </div>
              ) : draftCopy ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Listing Title</label>
                      {generatedCopy ? (
                        <button
                          type="button"
                          onClick={() => setDraftCopy(generatedCopy)}
                          className="text-xs font-medium text-gray-500 hover:text-black"
                        >
                          Reset to AI draft
                        </button>
                      ) : null}
                    </div>
                    <input
                      value={draftCopy.title}
                      onChange={(event) =>
                        setDraftCopy((current) =>
                          current ? { ...current, title: event.target.value } : current,
                        )
                      }
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-3 text-base font-semibold text-gray-900 outline-none transition-colors focus:border-black"
                      placeholder="Listing title"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Listing Description</label>
                    <textarea
                      value={draftCopy.description}
                      onChange={(event) =>
                        setDraftCopy((current) =>
                          current ? { ...current, description: event.target.value } : current,
                        )
                      }
                      rows={8}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-3 text-sm leading-relaxed text-gray-700 outline-none transition-colors focus:border-black"
                      placeholder="Listing description"
                    />
                  </div>

                  <button
                    onClick={() => onCopyGeneratedCopy(sellingItem.id, draftCopy)}
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
