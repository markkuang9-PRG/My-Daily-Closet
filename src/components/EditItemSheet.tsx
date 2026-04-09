import { useEffect, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import type { ClothingItem, ClothingMetadataInput } from '../types';

type EditItemSheetProps = {
  item: ClothingItem | null;
  isSaving: boolean;
  onCancel: () => void;
  onSave: (values: ClothingMetadataInput) => void;
};

const EMPTY_FORM: ClothingMetadataInput = {
  category: '',
  color: '',
  style: '',
  season: '',
};

export const EditItemSheet = ({ item, isSaving, onCancel, onSave }: EditItemSheetProps) => {
  const [formValues, setFormValues] = useState<ClothingMetadataInput>(EMPTY_FORM);

  useEffect(() => {
    if (!item) {
      setFormValues(EMPTY_FORM);
      return;
    }

    setFormValues({
      category: item.category,
      color: item.color,
      style: item.style,
      season: item.season,
    });
  }, [item]);

  if (!item) {
    return null;
  }

  const handleSave = () => {
    onSave({
      category: formValues.category.trim(),
      color: formValues.color.trim(),
      style: formValues.style.trim(),
      season: formValues.season.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 p-4 backdrop-blur-[1px]">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">Edit item details</p>
            <p className="text-xs text-gray-500">Fix the AI labels before using this item.</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
            aria-label="Close editor"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <img
            src={item.imageUrl}
            alt={item.category}
            className="h-40 w-full rounded-2xl object-cover"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
          />

          <label className="block space-y-1">
            <span className="text-xs font-medium text-gray-500">Category</span>
            <input
              value={formValues.category}
              onChange={(event) => setFormValues((current) => ({ ...current, category: event.target.value }))}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-black"
              placeholder="T-shirt"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-1">
              <span className="text-xs font-medium text-gray-500">Color</span>
              <input
                value={formValues.color}
                onChange={(event) => setFormValues((current) => ({ ...current, color: event.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-black"
                placeholder="Black"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-xs font-medium text-gray-500">Season</span>
              <input
                value={formValues.season}
                onChange={(event) => setFormValues((current) => ({ ...current, season: event.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-black"
                placeholder="All-season"
              />
            </label>
          </div>

          <label className="block space-y-1">
            <span className="text-xs font-medium text-gray-500">Style</span>
            <input
              value={formValues.style}
              onChange={(event) => setFormValues((current) => ({ ...current, style: event.target.value }))}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-black"
              placeholder="Minimal"
            />
          </label>
        </div>

        <div className="flex gap-3 border-t border-gray-100 px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:bg-gray-400"
          >
            {isSaving ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : (
              'Save changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
