import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import imageCompression from 'browser-image-compression';
import { fallbackCompressVideo, fallbackCompressImage } from './fallbackCompression';

let ffmpeg: FFmpeg | null = null;

const initFFmpeg = async (): Promise<FFmpeg> => {
  if (!ffmpeg) {
    ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd';

    try {
      console.log('[FFmpeg] Initializing...');
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      console.log('[FFmpeg] Successfully loaded core files.');
    } catch (error) {
      console.error('[FFmpeg] Failed to load core files:', error);
      throw new Error('Failed to initialize FFmpeg.');
    }
  }
  return ffmpeg;
};

export const compressVideo = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<File> => {
  if (!file || file.type.split('/')[0] !== 'video') {
    throw new Error('Invalid file type. Please upload a video file.');
  }

  try {
    console.log('[Video Compression] Starting...', {
      fileName: file.name,
      fileSize: formatFileSize(file.size),
      fileType: file.type,
      timestamp: new Date().toISOString(),
    });

    const ff = await initFFmpeg();

    // Remove previous progress listener
    ff.off('progress', () => {});

    // Add new progress listener
    ff.on('progress', (event: { progress: number; time: number }) => {
      const progress = Math.round(event.progress * 100);
      console.log(`[Video Compression] Progress: ${progress}%`, {
        time: event.time,
        timestamp: new Date().toISOString(),
      });
      if (onProgress) onProgress(progress);
    });

    const inputFileName = 'input.mp4';
    const outputFileName = 'output.webm';
    const fileData = await fetchFile(file);

    console.log('[Video Compression] Writing file to memory...');
    await ff.writeFile(inputFileName, fileData);

    console.log('[Video Compression] Executing FFmpeg command...');
    await ff.exec([
      '-i', inputFileName,
      '-c:v', 'libvpx-vp9',
      '-cpu-used', '4',
      '-deadline', 'realtime',
      '-threads', '4',
      '-tile-columns', '2',
      '-frame-parallel', '1',
      '-b:v', '2M',
      '-maxrate', '2.5M',
      '-bufsize', '4M',
      '-vf', 'scale=1280:-2',
      '-c:a', 'libopus',
      '-b:a', '96k',
      outputFileName,
    ]);

    console.log('[Video Compression] Reading compressed file...');
    const data = await ff.readFile(outputFileName);
    const compressedFile = new File([data], file.name.replace(/\.[^/.]+$/, '.webm'), { type: 'video/webm' });

    console.log('[Video Compression] Completed.', {
      originalSize: formatFileSize(file.size),
      compressedSize: formatFileSize(compressedFile.size),
      compressionRatio: `${((1 - compressedFile.size / file.size) * 100).toFixed(1)}%`,
      timestamp: new Date().toISOString(),
    });

    return compressedFile;
  } catch (error) {
    console.error('[Video Compression] Failed. Attempting fallback method...', error);
    return fallbackCompressVideo(file, { onProgress });
  }
};

export const compressImage = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<File> => {
  if (!file || file.type.split('/')[0] !== 'image') {
    throw new Error('Invalid file type. Please upload an image file.');
  }

  try {
    console.log('[Image Compression] Starting...', {
      fileName: file.name,
      fileSize: formatFileSize(file.size),
      fileType: file.type,
      timestamp: new Date().toISOString(),
    });

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      onProgress: onProgress
        ? (progress: number) => {
            const roundedProgress = Math.round(progress);
            console.log(`[Image Compression] Progress: ${roundedProgress}%`);
            onProgress(roundedProgress);
          }
        : undefined,
    };

    const compressedFile = await imageCompression(file, options);

    console.log('[Image Compression] Completed.', {
      originalSize: formatFileSize(file.size),
      compressedSize: formatFileSize(compressedFile.size),
      compressionRatio: `${((1 - compressedFile.size / file.size) * 100).toFixed(1)}%`,
      timestamp: new Date().toISOString(),
    });

    return compressedFile;
  } catch (error) {
    console.error('[Image Compression] Failed. Attempting fallback method...', error);
    return fallbackCompressImage(file, { onProgress });
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
