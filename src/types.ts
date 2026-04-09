export type AppTab = 'closet' | 'stylist' | 'market';

export interface ClothingItem {
  id: string;
  imageUrl: string;
  category: string;
  color: string;
  style: string;
  season: string;
  lastWorn: number;
  createdAt: number;
}

export interface ClothingMetadataInput {
  category: string;
  color: string;
  style: string;
  season: string;
}

export interface OutfitRecommendation {
  message: string;
  itemIds: string[];
}

export interface GeneratedCopy {
  title: string;
  description: string;
}

export type ToastTone = 'info' | 'success' | 'error';

export interface ToastInput {
  message: string;
  tone?: ToastTone;
}

export interface ToastItem extends ToastInput {
  id: string;
  tone: ToastTone;
}
