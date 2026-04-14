import { Loader2, Trash2, X } from 'lucide-react';
import type { ClothingItem } from '../types';

type DeleteItemSheetProps = {
  item: ClothingItem | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const DeleteItemSheet = ({ item, isDeleting, onCancel, onConfirm }: DeleteItemSheetProps) => {
  if (!item) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 p-4 backdrop-blur-[1px]">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">Delete item</p>
            <p className="text-xs text-gray-500">This removes the item from your closet.</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
            aria-label="Close delete confirmation"
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

          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">
            <p className="font-medium">
              Delete {item.color} {item.category}?
            </p>
            <p className="mt-1 text-red-700/90">
              This action removes the item from your closet inventory and market flow.
            </p>
          </div>
        </div>

        <div className="flex gap-3 border-t border-gray-100 px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Keep item
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:bg-red-300"
          >
            {isDeleting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete item
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
