import { describe, expect, it } from 'vitest';
import { validateUpload } from './upload';

const createFile = (type: string, size: number) => {
  const content = 'a'.repeat(size);
  return new File([content], 'sample-file', { type });
};

describe('validateUpload', () => {
  it('accepts a supported image smaller than the size limit', () => {
    const file = createFile('image/jpeg', 1024);
    expect(() => validateUpload(file)).not.toThrow();
  });

  it('rejects non-image files', () => {
    const file = createFile('text/plain', 1024);
    expect(() => validateUpload(file)).toThrow('Only image uploads are supported.');
  });

  it('rejects files larger than 10MB', () => {
    const file = createFile('image/png', 10 * 1024 * 1024 + 1);
    expect(() => validateUpload(file)).toThrow('Please upload an image smaller than 10MB.');
  });
});
