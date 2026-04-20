import type { ClothingItem } from '../types';

export const buildClothingAnalysisPrompt = () =>
  "Analyze this clothing item. Return ONLY a valid JSON object with these exact keys: 'category' (Top, Bottom, Shoes, Outerwear, Dress, Accessory), 'color', 'style' (Casual, Formal, Sport, Vintage, etc.), 'season' (Spring, Summer, Autumn, Winter, All). Do not include any markdown formatting like ```json.";

export const buildOutfitPrompt = (clothes: ClothingItem[], weather: string, occasion?: string) => {
  const wardrobeContext = clothes.map((item) => ({
    id: item.id,
    category: item.category,
    color: item.color,
    style: item.style,
    season: item.season,
  }));

  const occasionLine = occasion?.trim()
    ? `Occasion: ${occasion.trim()}
    Rules: Make the outfit appropriate for both the weather and this occasion. Prefer pieces whose style fits the occasion before falling back to more general picks.`
    : 'Occasion: Everyday wear';

  return `
    You are an AI fashion stylist.
    User Wardrobe: ${JSON.stringify(wardrobeContext)}
    Weather: ${weather}
    ${occasionLine}
    Rules: Create a stylish outfit using the available items. Try to include a Top and a Bottom, or a Dress. Add Outerwear if suitable for the weather. Do not invent items the user does not own.
    Return ONLY a valid JSON object with:
    - 'itemIds': an array of the 'id' strings of the selected items.
    - 'message': A warm, butler-style message explaining why this outfit works for the current weather${occasion?.trim() ? ` and occasion "${occasion.trim()}"` : ''} (e.g., "Today is ${weather}, this dark cargo pants will keep you warm...").
    Do not include markdown formatting.
  `;
};

export const buildSalesCopyPrompt = (item: ClothingItem) => `
  You are an expert second-hand clothing seller on Poshmark and eBay.
  Write an attractive sales listing for this item:
  - Category: ${item.category}
  - Color: ${item.color}
  - Style: ${item.style}
  - Season: ${item.season}

  Return ONLY a valid JSON object with:
  - 'title': A catchy, click-baity title (e.g., "Like New! Versatile Beige Casual Jacket...").
  - 'description': A detailed, persuasive description including styling tips and condition (assume gently used). Add relevant hashtags at the end.
  Do not include markdown formatting like \`\`\`json.
`;
