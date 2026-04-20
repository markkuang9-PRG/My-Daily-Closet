import { describe, expect, it } from 'vitest';
import { buildClothingAnalysisPrompt, buildOutfitPrompt, buildSalesCopyPrompt } from './prompts';
import type { ClothingItem } from '../types';

const sampleItem: ClothingItem = {
  id: 'item-1',
  imageUrl: 'https://example.com/image.jpg',
  category: 'Top',
  color: 'Black',
  style: 'Casual',
  season: 'All',
  lastWorn: 1,
  createdAt: 1,
};

describe('prompt builders', () => {
  it('builds clothing analysis prompt with required fields', () => {
    const prompt = buildClothingAnalysisPrompt();
    expect(prompt).toContain("'category'");
    expect(prompt).toContain("'color'");
    expect(prompt).toContain("'style'");
    expect(prompt).toContain("'season'");
  });

  it('builds outfit prompt with weather and wardrobe context', () => {
    const prompt = buildOutfitPrompt([sampleItem], '20°C, Clear');
    expect(prompt).toContain('20°C, Clear');
    expect(prompt).toContain('"id":"item-1"');
    expect(prompt).toContain("'itemIds'");
    expect(prompt).toContain("'message'");
  });

  it('builds outfit prompt with occasion guidance when provided', () => {
    const prompt = buildOutfitPrompt([sampleItem], '12°C, Rainy', 'Office meeting');
    expect(prompt).toContain('Occasion: Office meeting');
    expect(prompt).toContain('appropriate for both the weather and this occasion');
    expect(prompt).toContain('occasion "Office meeting"');
  });

  it('builds sales copy prompt with item details', () => {
    const prompt = buildSalesCopyPrompt(sampleItem);
    expect(prompt).toContain('Category: Top');
    expect(prompt).toContain('Color: Black');
    expect(prompt).toContain("'title'");
    expect(prompt).toContain("'description'");
  });
});
