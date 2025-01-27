import React from 'react';
import { Progress } from '@/components/ui/progress';
import { formatFileSize } from '@/utils/compression';
import { AlertCircle } from 'lucide-react';

interface CompressionProgressProps {
  isCompressing: boolean;
  compressionProgress: number;
  originalSize: number | null;
  compressedSize: number | null;
  timeLeft?: string;
  speed?: string;
}

export const CompressionProgress: React.FC<CompressionProgressProps> = ({
  isCompressing,
  compressionProgress,
  originalSize,
  compressedSize,
  timeLeft = 'Calculating...',
  speed = '0x'
}) => {
  if (!isCompressing) return null;

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-yellow-500 animate-pulse" />
          <span className="text-muted-foreground">Compression en cours...</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">Vitesse: {speed}</span>
          <span className="text-muted-foreground">Temps restant: {timeLeft}</span>
        </div>
      </div>
      
      <Progress value={compressionProgress} className="h-2" />
      
      {originalSize && (
        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <p className="font-medium">Taille originale:</p>
            <p>{formatFileSize(originalSize)}</p>
          </div>
          <div>
            <p className="font-medium">Taille actuelle:</p>
            <p>
              {compressedSize ? formatFileSize(compressedSize) : 'En cours...'}
              {compressedSize && (
                <span className="ml-2 text-green-500">
                  (-{((originalSize - compressedSize) / originalSize * 100).toFixed(1)}%)
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};