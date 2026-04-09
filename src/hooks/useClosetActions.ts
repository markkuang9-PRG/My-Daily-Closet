import { useRef, useState, type ChangeEvent } from 'react';
import type { User } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { requireAiClient } from '../lib/gemini';
import { logAppError } from '../lib/logger';
import { buildClothingAnalysisPrompt, buildOutfitPrompt, buildSalesCopyPrompt } from '../lib/prompts';
import { compressImage, validateUpload } from '../lib/upload';
import type { ClothingItem, ClothingMetadataInput, GeneratedCopy, OutfitRecommendation } from '../types';

type UseClosetActionsArgs = {
  clothes: ClothingItem[];
  currentPath: string;
  user: User | null;
  weather: string;
};

const parseModelJson = (text: string | undefined) => {
  const cleanJsonStr = text?.replace(/```json/g, '').replace(/```/g, '').trim() || '{}';
  return JSON.parse(cleanJsonStr);
};

export const useClosetActions = ({ clothes, currentPath, user, weather }: UseClosetActionsArgs) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isStyling, setIsStyling] = useState(false);
  const [outfitRecommendation, setOutfitRecommendation] = useState<OutfitRecommendation | null>(null);
  const [sellingItem, setSellingItem] = useState<ClothingItem | null>(null);
  const [generatedCopy, setGeneratedCopy] = useState<GeneratedCopy | null>(null);
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
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
      const response = await requireAiClient().models.generateContent({
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
      alert(error instanceof Error ? error.message : 'Upload or analysis failed, please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const generateOutfit = async () => {
    if (clothes.length === 0) {
      alert('Your closet is empty! Please upload some clothes first.');
      return;
    }

    setIsStyling(true);

    try {
      const response = await requireAiClient().models.generateContent({
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
      alert(error instanceof Error ? error.message : 'Failed to generate outfit, please try again.');
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
      alert('Success! Updated the wear history for these items.');
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
      alert('Failed to update wear history, please try again.');
      return false;
    }
  };

  const generateSalesCopy = async (item: ClothingItem) => {
    setSellingItem(item);
    setIsGeneratingCopy(true);
    setGeneratedCopy(null);

    try {
      const response = await requireAiClient().models.generateContent({
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
      alert(error instanceof Error ? error.message : 'Failed to generate copy, please try again.');
      setSellingItem(null);
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  const clearSellingItem = () => {
    setSellingItem(null);
    setGeneratedCopy(null);
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
      alert('Failed to save item details, please try again.');
      return false;
    } finally {
      setIsSavingEdit(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!user) return;
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'clothes', id));
      if (sellingItem?.id === id) {
        clearSellingItem();
      }
      if (editingItem?.id === id) {
        setEditingItem(null);
      }
    } catch (error) {
      logAppError(error, {
        operation: 'delete_clothing_item',
        path: currentPath,
        userId: user.uid,
        extra: {
          itemId: id,
        },
      });
    }
  };

  const copyGeneratedCopy = async (itemId: string, copy: GeneratedCopy) => {
    await navigator.clipboard.writeText(`${copy.title}\n\n${copy.description}`);
    alert('Copy copied to clipboard! You can paste it directly to Poshmark or eBay.');
    await deleteItem(itemId);
  };

  return {
    cancelEditingItem,
    deleteItem,
    editingItem,
    generateOutfit,
    generateSalesCopy,
    generatedCopy,
    handleFileUpload,
    fileInputRef,
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
    startEditingItem,
  };
};
