import { describe, expect, it } from 'vitest';
import {
  parseClothingAnalysisResult,
  parseOutfitRecommendationResult,
  parseSalesCopyResult,
} from './aiResponse';

describe('AI response parsers', () => {
  it('parses clothing analysis wrapped in markdown fences', () => {
    const result = parseClothingAnalysisResult(`\`\`\`json
      {"category":"Top","color":"Black","style":"Casual","season":"All"}
    \`\`\``);

    expect(result).toEqual({
      category: 'Top',
      color: 'Black',
      style: 'Casual',
      season: 'All',
    });
  });

  it('fills missing clothing analysis fields with Unknown', () => {
    const result = parseClothingAnalysisResult('{"category":"Dress","color":"","style":"Evening"}');

    expect(result).toEqual({
      category: 'Dress',
      color: 'Unknown',
      style: 'Evening',
      season: 'Unknown',
    });
  });

  it('extracts outfit JSON from surrounding prose', () => {
    const result = parseOutfitRecommendationResult(
      'Here is the best option for today: {"itemIds":[" top-1 ","bottom-2"],"message":"Great for a rainy office day."} Enjoy.',
    );

    expect(result).toEqual({
      itemIds: ['top-1', 'bottom-2'],
      message: 'Great for a rainy office day.',
    });
  });

  it('falls back when sales copy fields are missing', () => {
    const result = parseSalesCopyResult('{"title":"  ","description":null}');

    expect(result).toEqual({
      title: 'Untitled listing draft',
      description: 'Gently used item. Add your own condition notes, measurements, and shipping details before posting.',
    });
  });

  it('throws on malformed outfit JSON', () => {
    expect(() => parseOutfitRecommendationResult('{"itemIds":["top-1"],"message":"Missing brace"')).toThrow(
      'AI response did not contain a valid JSON object.',
    );
  });

  it('throws when outfit response has no valid item IDs', () => {
    expect(() => parseOutfitRecommendationResult('{"itemIds":[],"message":"Nice look"}')).toThrow(
      'AI outfit response did not include any valid item IDs.',
    );
  });
});
