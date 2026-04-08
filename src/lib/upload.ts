export const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxWidth = 500;
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
        resolve(canvas.toDataURL('image/jpeg', 0.6));
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
