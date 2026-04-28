import type { ClothingMetadataInput, GeneratedCopy, OutfitRecommendation } from '../types';

const extractJsonBlock = (text: string) => {
  const cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();

  try {
    return JSON.parse(cleanText);
  } catch {
    const objectStart = cleanText.indexOf('{');
    const objectEnd = cleanText.lastIndexOf('}');

    if (objectStart === -1 || objectEnd === -1 || objectEnd <= objectStart) {
      throw new Error('AI response did not contain a valid JSON object.');
    }

    return JSON.parse(cleanText.slice(objectStart, objectEnd + 1));
  }
};

const toTrimmedString = (value: unknown, fallback: string) =>
  typeof value === 'string' && value.trim() ? value.trim() : fallback;

const toStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === 'string').map((entry) => entry.trim()).filter(Boolean)
    : [];

export const parseClothingAnalysisResult = (text: string | undefined): ClothingMetadataInput => {
  const parsed = extractJsonBlock(text?.trim() || '{}') as Record<string, unknown>;

  return {
    category: toTrimmedString(parsed.category, 'Unknown'),
    color: toTrimmedString(parsed.color, 'Unknown'),
    style: toTrimmedString(parsed.style, 'Unknown'),
    season: toTrimmedString(parsed.season, 'Unknown'),
  };
};

export const parseOutfitRecommendationResult = (text: string | undefined): OutfitRecommendation => {
  const parsed = extractJsonBlock(text?.trim() || '') as Record<string, unknown>;
  const itemIds = toStringArray(parsed.itemIds);

  if (itemIds.length === 0) {
    throw new Error('AI outfit response did not include any valid item IDs.');
  }

  return {
    itemIds,
    message: toTrimmedString(
      parsed.message,
      'These items fit the current weather and occasion, even though the AI explanation came back incomplete.',
    ),
  };
};

export const parseSalesCopyResult = (text: string | undefined): GeneratedCopy => {
  const parsed = extractJsonBlock(text?.trim() || '{}') as Record<string, unknown>;

  return {
    title: toTrimmedString(parsed.title, 'Untitled listing draft'),
    description: toTrimmedString(
      parsed.description,
      'Gently used item. Add your own condition notes, measurements, and shipping details before posting.',
    ),
  };
};
