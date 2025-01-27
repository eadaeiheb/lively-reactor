import React from 'react';
import { FileVideo, ImageIcon, X } from 'lucide-react';
import { formatFileSize } from '@/utils/compression';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface FileWithPreview extends File {
  preview?: string;
}

interface FileUploadBoxProps {
  type: 'thumbnail';
  file: FileWithPreview | null;
  isCompressing: boolean;
  compressionProgress: number;
  originalSize: number | null;
  compressedSize: number | null;
  timeLeft?: string;
  speed?: string;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileRemove?: () => void;
  onCancel?: () => void;
}

export const FileUploadBox: React.FC<FileUploadBoxProps> = ({
  type,
  file,
  isCompressing,
  compressionProgress,
  originalSize,
  compressedSize,
  timeLeft,
  speed,
  onFileSelect,
  onFileRemove,
  onCancel
}) => {
  const Icon = type === 'thumbnail' ? ImageIcon : FileVideo;
  const inputId = `${type}Input`;

  return (
    <div 
      className={`
        border-2 border-dashed border-border/40 rounded-lg p-6 text-center 
        cursor-pointer hover:bg-dashboard-background/50 transition-colors relative
        ${file ? 'bg-primary/5 border-primary/40' : ''}
        ${isCompressing ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={() => !isCompressing && document.getElementById(inputId)?.click()}
    >
      {file && (
        <>
          {type === 'thumbnail' && file.preview ? (
            <img 
              src={file.preview} 
              alt="Aperçu de la miniature" 
              className="w-32 h-32 object-cover mx-auto rounded-lg"
            />
          ) : null}

          {onFileRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFileRemove();
              }}
              className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              disabled={isCompressing}
            >
              <X className="w-4 h-4 text-white" />
            </button>
          )}

          <div className="mt-4 text-sm text-muted-foreground">
            <p className="font-medium truncate max-w-[200px] mx-auto">
              {file.name}
            </p>
            {originalSize && (
              <p className="mt-1">
                Taille originale: {formatFileSize(originalSize)}
                {compressedSize && (
                  <>
                    <br />
                    Taille compressée: {formatFileSize(compressedSize)}
                    <br />
                    Réduction: {((originalSize - compressedSize) / originalSize * 100).toFixed(1)}%
                  </>
                )}
              </p>
            )}
          </div>

          {isCompressing && timeLeft && speed && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Compression: {compressionProgress}%</span>
                <span>Vitesse: {speed}</span>
              </div>
              <Progress value={compressionProgress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Temps restant: {timeLeft}
              </p>
              {onCancel && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancel();
                  }}
                  className="mt-2"
                >
                  Annuler la compression
                </Button>
              )}
            </div>
          )}
        </>
      )}

      {!file && (
        <>
          <Icon className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isCompressing ? 'Compression en cours...' : `Déposez ${type === 'thumbnail' ? 'la miniature' : 'la vidéo'} ici ou cliquez pour parcourir`}
          </p>
        </>
      )}

      <input
        type="file"
        id={inputId}
        onChange={onFileSelect}
        accept={type === 'thumbnail' ? 'image/*' : 'video/*'}
        className="hidden"
        disabled={isCompressing}
      />
    </div>
  );
};