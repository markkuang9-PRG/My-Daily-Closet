import type { ChangeEvent, RefObject } from 'react';
import { Camera, Loader2, Shirt } from 'lucide-react';
import { motion } from 'motion/react';
import { ClothingCard } from '../components/ClothingCard';
import { DeleteItemSheet } from '../components/DeleteItemSheet';
import { EditItemSheet } from '../components/EditItemSheet';
import type { ClothingItem, ClothingMetadataInput } from '../types';

type ClosetViewProps = {
  clothes: ClothingItem[];
  deletingItem: ClothingItem | null;
  editingItem: ClothingItem | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  isDeletingItem: boolean;
  isSavingEdit: boolean;
  onCancelDelete: () => void;
  isUploading: boolean;
  onCancelEdit: () => void;
  onConfirmDelete: () => void;
  onEditItem: (item: ClothingItem) => void;
  onFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onDeleteItem: (item: ClothingItem) => void;
  onSaveEdit: (values: ClothingMetadataInput) => void;
};

export const ClosetView = ({
  clothes,
  deletingItem,
  editingItem,
  fileInputRef,
  isDeletingItem,
  isSavingEdit,
  onCancelDelete,
  isUploading,
  onCancelEdit,
  onConfirmDelete,
  onEditItem,
  onFileUpload,
  onDeleteItem,
  onSaveEdit,
}: ClosetViewProps) => {
  return (
    <>
      <motion.div
        key="closet"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="space-y-4"
      >
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full bg-black text-white rounded-2xl p-4 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:bg-gray-400 shadow-sm"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>AI analyzing & adding...</span>
            </>
          ) : (
            <>
              <Camera className="w-5 h-5" />
              <span className="font-medium">Take Photo / Upload Item</span>
            </>
          )}
        </button>
        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={onFileUpload} />

        {clothes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-center">
            <Shirt className="w-12 h-12 mb-3 opacity-20" />
            <p>Your closet is empty</p>
            <p className="text-sm mt-1">Click the button above to add your first item!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mt-6">
            {clothes.map((item) => {
              const daysSinceWorn = Math.floor((Date.now() - item.lastWorn) / (1000 * 60 * 60 * 24));
              return (
                <div key={item.id}>
                  <ClothingCard
                    item={item}
                    idleLabel={daysSinceWorn > 90 ? `Idle for ${daysSinceWorn} days` : null}
                    onDelete={onDeleteItem}
                    onEdit={onEditItem}
                  />
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      <EditItemSheet item={editingItem} isSaving={isSavingEdit} onCancel={onCancelEdit} onSave={onSaveEdit} />
      <DeleteItemSheet item={deletingItem} isDeleting={isDeletingItem} onCancel={onCancelDelete} onConfirm={onConfirmDelete} />
    </>
  );
};
