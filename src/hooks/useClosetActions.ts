import { useRef, useState, type ChangeEvent } from 'react';
import type { User } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAiClient } from '../lib/gemini';
import { logAppError } from '../lib/logger';
import { buildClothingAnalysisPrompt, buildOutfitPrompt, buildSalesCopyPrompt } from '../lib/prompts';
import { compressImage, validateUpload } from '../lib/upload';
import type { ClothingItem, ClothingMetadataInput, GeneratedCopy, OutfitRecommendation, ToastInput } from '../types';

type UseClosetActionsArgs = {
  clothes: ClothingItem[];
  currentPath: string;
  notify: (toast: ToastInput) => void;
  user: User | null;
  weather: string;
};

type DeleteItemOptions = {
  failureMessage?: string;
  skipConfirm?: boolean;
  suppressFailureToast?: boolean;
};

const parseModelJson = (text: string | undefined) => {
  const cleanJsonStr = text?.replace(/```json/g, '').replace(/```/g, '').trim() || '{}';
  return JSON.parse(cleanJsonStr);
};

export const useClosetActions = ({ clothes, currentPath, notify, user, weather }: UseClosetActionsArgs) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isStyling, setIsStyling] = useState(false);
  const [outfitRecommendation, setOutfitRecommendation] = useState<OutfitRecommendation | null>(null);
  const [sellingItem, setSellingItem] = useState<ClothingItem | null>(null);
  const [generatedCopy, setGeneratedCopy] = useState<GeneratedCopy | null>(null);
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [deletingItem, setDeletingItem] = useState<ClothingItem | null>(null);
  const [isDeletingItem, setIsDeletingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);

    try {
      validateUpload(file);

      const base64String = await compressImage(file);
      if (base64String.length > 1_000_000) {
        throw new Error('Compressed image is still too large. Please use a smaller image.');
      }

      const base64Data = base64String.split(',')[1];
      const aiClient = await getAiClient();
      const response = await aiClient.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ inlineData: { data: base64Data, mimeType: 'image/jpeg' } }, buildClothingAnalysisPrompt()],
      });

      let aiResult;
      try {
        aiResult = parseModelJson(response.text);
      } catch (error) {
        logAppError(error, {
          operation: 'parse_clothing_analysis',
          path: currentPath,
          userId: user.uid,
        });
        aiResult = { category: 'Unknown', color: 'Unknown', style: 'Unknown', season: 'Unknown' };
      }

      await addDoc(collection(db, 'users', user.uid, 'clothes'), {
        imageUrl: base64String,
        category: aiResult.category || 'Unknown',
        color: aiResult.color || 'Unknown',
        style: aiResult.style || 'Unknown',
        season: aiResult.season || 'Unknown',
        lastWorn: Date.now(),
        createdAt: Date.now(),
      });
    } catch (error) {
      logAppError(error, {
        operation: 'upload_clothing_item',
        path: currentPath,
        userId: user.uid,
        extra: {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        },
      });
      notify({
        message: error instanceof Error ? error.message : 'Upload or analysis failed, please try again.',
        tone: 'error',
      });
      return;
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }

    notify({
      message: 'Item added to your closet. Review and edit the labels if needed.',
      tone: 'success',
    });
  };

  const generateOutfit = async () => {
    if (clothes.length === 0) {
      notify({
        message: 'Your closet is empty. Upload some clothes first.',
        tone: 'info',
      });
      return;
    }

    setIsStyling(true);

    try {
      const aiClient = await getAiClient();
      const response = await aiClient.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: buildOutfitPrompt(clothes, weather),
      });

      const result = parseModelJson(response.text) as OutfitRecommendation;
      setOutfitRecommendation(result);
    } catch (error) {
      logAppError(error, {
        operation: 'generate_outfit',
        path: currentPath,
        userId: user?.uid ?? null,
        extra: {
          clothesCount: clothes.length,
          weather,
        },
      });
      notify({
        message: error instanceof Error ? error.message : 'Failed to generate outfit, please try again.',
        tone: 'error',
      });
    } finally {
      setIsStyling(false);
    }
  };

  const confirmOutfit = async () => {
    if (!user || !outfitRecommendation) return false;

    try {
      const now = Date.now();
      await Promise.all(
        outfitRecommendation.itemIds.map((id) => updateDoc(doc(db, 'users', user.uid, 'clothes', id), { lastWorn: now })),
      );
      notify({
        message: 'Updated the wear history for the recommended items.',
        tone: 'success',
      });
      setOutfitRecommendation(null);
      return true;
    } catch (error) {
      logAppError(error, {
        operation: 'confirm_outfit',
        path: currentPath,
        userId: user.uid,
        extra: {
          itemIds: outfitRecommendation.itemIds,
        },
      });
      notify({
        message: 'Failed to update wear history, please try again.',
        tone: 'error',
      });
      return false;
    }
  };

  const generateSalesCopy = async (item: ClothingItem) => {
    setSellingItem(item);
    setIsGeneratingCopy(true);
    setGeneratedCopy(null);

    try {
      const aiClient = await getAiClient();
      const response = await aiClient.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: buildSalesCopyPrompt(item),
      });

      const result = parseModelJson(response.text) as GeneratedCopy;
      setGeneratedCopy(result);
    } catch (error) {
      logAppError(error, {
        operation: 'generate_sales_copy',
        path: currentPath,
        userId: user?.uid ?? null,
        extra: {
          itemId: item.id,
        },
      });
      notify({
        message: error instanceof Error ? error.message : 'Failed to generate copy, please try again.',
        tone: 'error',
      });
      setSellingItem(null);
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  const clearSellingItem = () => {
    setSellingItem(null);
    setGeneratedCopy(null);
  };

  const startDeletingItem = (item: ClothingItem) => {
    if (isDeletingItem) return;
    setDeletingItem(item);
  };

  const cancelDeletingItem = () => {
    if (isDeletingItem) return;
    setDeletingItem(null);
  };

  const startEditingItem = (item: ClothingItem) => {
    setEditingItem(item);
  };

  const cancelEditingItem = () => {
    if (isSavingEdit) return;
    setEditingItem(null);
  };

  const saveItemMetadata = async (values: ClothingMetadataInput) => {
    if (!user || !editingItem) return false;

    const normalizedValues = {
      category: values.category || 'Unknown',
      color: values.color || 'Unknown',
      style: values.style || 'Unknown',
      season: values.season || 'Unknown',
    };

    setIsSavingEdit(true);

    try {
      await updateDoc(doc(db, 'users', user.uid, 'clothes', editingItem.id), normalizedValues);
      setEditingItem(null);
      notify({
        message: 'Item details updated.',
        tone: 'success',
      });
      return true;
    } catch (error) {
      logAppError(error, {
        operation: 'save_clothing_metadata',
        path: currentPath,
        userId: user.uid,
        extra: {
          itemId: editingItem.id,
          values: normalizedValues,
        },
      });
      notify({
        message: 'Failed to save item details, please try again.',
        tone: 'error',
      });
      return false;
    } finally {
      setIsSavingEdit(false);
    }
  };

  const deleteItem = async (id: string, options: DeleteItemOptions = {}) => {
    if (!user) return false;

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'clothes', id));
      if (sellingItem?.id === id) {
        clearSellingItem();
      }
      if (editingItem?.id === id) {
        setEditingItem(null);
      }
      return true;
    } catch (error) {
      logAppError(error, {
        operation: 'delete_clothing_item',
        path: currentPath,
        userId: user.uid,
        extra: {
          itemId: id,
        },
      });
      if (!options.suppressFailureToast) {
        notify({
          message: options.failureMessage ?? 'Failed to delete item, please try again.',
          tone: 'error',
        });
      }
      return false;
    }
  };

  const confirmDeletingItem = async () => {
    if (!deletingItem) return false;

    setIsDeletingItem(true);
    const didDelete = await deleteItem(deletingItem.id, {
      skipConfirm: true,
    });
    setIsDeletingItem(false);

    if (didDelete) {
      setDeletingItem(null);
    }

    return didDelete;
  };

  const copyGeneratedCopy = async (itemId: string, copy: GeneratedCopy) => {
    try {
      await navigator.clipboard.writeText(`${copy.title}\n\n${copy.description}`);
    } catch (error) {
      logAppError(error, {
        operation: 'copy_sales_copy',
        path: currentPath,
        userId: user?.uid ?? null,
        extra: {
          itemId,
        },
      });
      notify({
        message: 'Clipboard copy failed. Your draft is still here, so you can try again.',
        tone: 'error',
      });
      return false;
    }

    const didDelete = await deleteItem(itemId, {
      skipConfirm: true,
      suppressFailureToast: true,
    });

    if (!didDelete) {
      notify({
        message: 'Copy succeeded, but the item could not be removed from your closet. Please try deleting it again.',
        tone: 'error',
      });
      return false;
    }

    notify({
      message: 'Copy added to clipboard. You can paste it into Poshmark or eBay.',
      tone: 'success',
    });
    return true;
  };

  return {
    cancelDeletingItem,
    cancelEditingItem,
    confirmDeletingItem,
    deletingItem,
    deleteItem,
    editingItem,
    generateOutfit,
    generateSalesCopy,
    generatedCopy,
    handleFileUpload,
    fileInputRef,
    isDeletingItem,
    isGeneratingCopy,
    isSavingEdit,
    isStyling,
    isUploading,
    outfitRecommendation,
    clearSellingItem,
    confirmOutfit,
    copyGeneratedCopy,
    saveItemMetadata,
    sellingItem,
    startDeletingItem,
    startEditingItem,
  };
};
