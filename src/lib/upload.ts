type CompressImageOptions = {
  maxWidth?: number;
  quality?: number;
};

export const compressImage = (file: File, options: CompressImageOptions = {}): Promise<string> => {
  return new Promise((resolve, reject) => {
    const { maxWidth = 420, quality = 0.55 } = options;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = (error) => reject(error);
    };
  });
};

export const validateUpload = (file: File) => {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image uploads are supported.');
  }

  const maxOriginalFileSize = 10 * 1024 * 1024;
  if (file.size > maxOriginalFileSize) {
    throw new Error('Please upload an image smaller than 10MB.');
  }
};
