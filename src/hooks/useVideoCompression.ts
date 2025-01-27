import { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { useToast } from '@/hooks/use-toast';

export const useVideoCompression = () => {
  const [loaded, setLoaded] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Loading FFmpeg...');
  const ffmpegRef = useRef(new FFmpeg());
  const { toast } = useToast();

  useEffect(() => {
    loadFFmpeg();
    return () => {
      const ffmpeg = ffmpegRef.current;
      if (ffmpeg) {
        ffmpeg.terminate();
      }
    };
  }, []);

  const loadFFmpeg = async () => {
    const ffmpeg = ffmpegRef.current;
    try {
      console.log('Loading FFmpeg...');
      setLoadingMessage('Downloading FFmpeg...');
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
      
      ffmpeg.on('log', ({ message }) => {
        console.log('FFmpeg Log:', message);
      });

      ffmpeg.on('progress', ({ progress, time }) => {
        const percentage = Math.round(progress * 100);
        console.log('Compression progress:', percentage);
        setCompressionProgress(percentage);
        setLoadingMessage(`Processing: ${percentage}% (${(time / 1000000).toFixed(1)}s)`);
      });

      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      
      setLoaded(true);
      setLoadingMessage('');
      console.log('FFmpeg loaded successfully');
    } catch (error) {
      console.error('Error loading FFmpeg:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load video compression. Please refresh and try again."
      });
    }
  };

  const handleFileCompression = async (file: File, targetSize: number) => {
    if (!loaded) {
      toast({
        title: "Please wait",
        description: "Video compression is still loading..."
      });
      return null;
    }

    const ffmpeg = ffmpegRef.current;
    setIsCompressing(true);
    setOriginalSize(file.size);
    setCompressionProgress(0);
    setLoadingMessage('Preparing video...');

    try {
      console.log('Starting video compression...');
      await ffmpeg.writeFile('input.mp4', await fetchFile(file));
      
      setLoadingMessage('Compressing video...');
      
      // Calculate bitrate based on target size
      const duration = await getVideoDuration(file);
      const targetBitrate = Math.floor((targetSize * 8) / duration); // bits per second
      const videoBitrate = Math.floor(targetBitrate * 0.95); // 95% for video
      const audioBitrate = Math.floor(targetBitrate * 0.05); // 5% for audio

      await ffmpeg.exec([
        '-i', 'input.mp4',
        '-c:v', 'libx264',
        '-preset', 'veryfast', // Fast compression
        '-b:v', `${videoBitrate}`,
        '-maxrate', `${videoBitrate * 1.5}`,
        '-bufsize', `${videoBitrate * 2}`,
        '-c:a', 'aac',
        '-b:a', `${audioBitrate}`,
        '-movflags', '+faststart',
        '-y',
        'output.mp4'
      ]);

      setLoadingMessage('Finalizing...');
      const data = await ffmpeg.readFile('output.mp4');
      const compressedBlob = new Blob([data], { type: 'video/mp4' });
      setCompressedSize(compressedBlob.size);
      
      const compressedFile = new File([compressedBlob], file.name, {
        type: 'video/mp4',
      });

      console.log('Compression complete', {
        originalSize: file.size,
        compressedSize: compressedFile.size,
        reduction: ((file.size - compressedFile.size) / file.size * 100).toFixed(1) + '%'
      });

      setLoadingMessage('Compression complete!');
      setCompressionProgress(100);
      
      return compressedFile;
    } catch (error) {
      console.error('Error during compression:', error);
      toast({
        variant: "destructive",
        title: "Compression Error",
        description: "Failed to compress video. Please try again."
      });
      return null;
    } finally {
      setIsCompressing(false);
    }
  };

  return {
    isCompressing,
    originalSize,
    compressedSize,
    compressionProgress,
    loadingMessage,
    handleFileCompression
  };
};

const getVideoDuration = async (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.src = URL.createObjectURL(file);
  });
};