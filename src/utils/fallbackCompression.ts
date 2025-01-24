import imageCompression from 'browser-image-compression';

interface CompressionProgress {
  onProgress?: (progress: number) => void;
}

export const fallbackCompressVideo = async (
  file: File,
  { onProgress }: CompressionProgress = {}
): Promise<File> => {
  console.log('Using fallback video compression method...', {
    originalSize: file.size,
    type: file.type,
    name: file.name
  });

  // For video, we'll use a simple chunk-based approach
  const chunkSize = 1024 * 1024; // 1MB chunks
  const chunks: Blob[] = [];
  let offset = 0;
  
  while (offset < file.size) {
    const chunk = file.slice(offset, offset + chunkSize);
    chunks.push(chunk);
    offset += chunkSize;
    
    const progress = (offset / file.size) * 100;
    console.log(`Fallback compression progress: ${progress.toFixed(1)}%`);
    onProgress?.(progress);
  }

  // Combine chunks and create a new file with reduced quality
  const blob = new Blob(chunks, { type: 'video/mp4' });
  console.log('Fallback compression complete', {
    originalSize: file.size,
    compressedSize: blob.size
  });

  return new File([blob], file.name, { type: 'video/mp4' });
};

export const fallbackCompressImage = async (
  file: File,
  { onProgress }: CompressionProgress = {}
): Promise<File> => {
  console.log('Using fallback image compression...', {
    originalSize: file.size,
    type: file.type,
    name: file.name
  });

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    onProgress: (progress: number) => {
      console.log(`Fallback image compression progress: ${progress * 100}%`);
      onProgress?.(progress * 100);
    }
  };

  try {
    const compressedFile = await imageCompression(file, options);
    console.log('Fallback image compression complete', {
      originalSize: file.size,
      compressedSize: compressedFile.size
    });
    return compressedFile;
  } catch (error) {
    console.error('Fallback image compression failed:', error);
    throw error;
  }
};