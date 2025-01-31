import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Upload, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChapterManager } from '@/components/video-upload/ChapterManager';
import { VideoUploadForm } from '@/components/video-upload/VideoUploadForm';
import { formatFileSize } from '@/utils/compression';
import { useVideoCompression } from '@/hooks/useVideoCompression';
import { useVideoUploadForm } from '@/hooks/useVideoUploadForm';
import { Progress } from '@/components/ui/progress';

interface VideosProps {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

const MAX_TOTAL_SIZE = 450 * 1024 * 1024; // 450MB in bytes
const SIZE_THRESHOLD = 500 * 1024 * 1024; // 500MB threshold

const Videos: React.FC<VideosProps> = ({ user }) => {
  const [enableCompression, setEnableCompression] = React.useState(true);
  const [totalFileSize, setTotalFileSize] = React.useState(0);
  const { toast } = useToast();

  const {
    isCompressing,
    originalSize,
    compressedSize,
    compressionProgress,
    loadingMessage,
    handleFileCompression,
  } = useVideoCompression();

  const {
    title,
    setTitle,
    description,
    setDescription,
    videoFile,
    setVideoFile,
    thumbnailFile,
    setThumbnailFile,
    uploadProgress,
    isUploading,
    selectedChapter,
    setSelectedChapter,
    selectedSubchapter,
    setSelectedSubchapter,
    handleSubmit
  } = useVideoUploadForm();

  useEffect(() => {
    const videoSize = videoFile?.size || 0;
    const thumbnailSize = thumbnailFile?.size || 0;
    const newTotalSize = videoSize + thumbnailSize;
    setTotalFileSize(newTotalSize);

    if (newTotalSize > SIZE_THRESHOLD) {
      setEnableCompression(true);
      toast({
        title: "Compression automatique activée",
        description: `La taille totale des fichiers (${formatFileSize(newTotalSize)}) dépasse 500MB. La compression sera appliquée automatiquement pour atteindre une taille maximale de 450MB.`,
        duration: 5000,
      });
    }
  }, [videoFile, thumbnailFile]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'video' | 'thumbnail'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (type === 'video' && !file.type.startsWith('video/')) {
      toast({
        variant: "destructive",
        title: "Type de fichier invalide",
        description: "Veuillez sélectionner un fichier vidéo"
      });
      return;
    }

    if (type === 'thumbnail' && !file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Type de fichier invalide",
        description: "Veuillez sélectionner une image"
      });
      return;
    }

    const otherFileSize = type === 'video' ? (thumbnailFile?.size || 0) : (videoFile?.size || 0);
    const newTotalSize = file.size + otherFileSize;

    try {
      if (type === 'video' && (file.size > SIZE_THRESHOLD || newTotalSize > MAX_TOTAL_SIZE)) {
        console.log('Starting video compression...');
        // Calculate target size to ensure final size is under 450MB
        const targetSize = Math.min(MAX_TOTAL_SIZE - otherFileSize, MAX_TOTAL_SIZE);
        const compressedFile = await handleFileCompression(file, targetSize);
        if (compressedFile) {
          console.log('Video compression complete');
          setVideoFile(compressedFile);
          toast({
            title: "Compression réussie",
            description: `Taille originale: ${formatFileSize(file.size)}\nTaille compressée: ${formatFileSize(compressedFile.size)}`,
          });
        }
      } else {
        if (type === 'video') {
          setVideoFile(file);
        } else {
          const fileWithPreview = Object.assign(file, {
            preview: URL.createObjectURL(file)
          });
          setThumbnailFile(fileWithPreview);
        }
      }
    } catch (error) {
      console.error('Error handling file:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement du fichier"
      });
    }
  };

  return (
    <div className="p-6 mt-16 max-w-5xl mx-auto space-y-6">
      <ChapterManager />
      
      <Card className="bg-dashboard-card border-border/40">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-semibold">Télécharger une nouvelle vidéo</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Compression automatique</span>
              <Switch
                checked={enableCompression}
                onCheckedChange={setEnableCompression}
                disabled={totalFileSize > SIZE_THRESHOLD}
              />
            </div>
          </div>

          {totalFileSize > 0 && (
            <Alert variant={totalFileSize > SIZE_THRESHOLD ? "destructive" : "default"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Taille totale des fichiers</AlertTitle>
              <AlertDescription>
                {formatFileSize(totalFileSize)}
                {totalFileSize > SIZE_THRESHOLD && " - Compression automatique activée"}
              </AlertDescription>
            </Alert>
          )}

          {isCompressing && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{loadingMessage}</span>
                <span>{compressionProgress}%</span>
              </div>
              <Progress value={compressionProgress} className="h-2" />
              {originalSize && (
                <p className="text-sm text-muted-foreground">
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
          )}

          <p className="text-sm text-muted-foreground">
            Partagez votre contenu avec votre audience. Les fichiers de plus de 500MB seront automatiquement compressés pour optimiser le stockage.
          </p>
        </CardHeader>
        <CardContent>
          <VideoUploadForm
            title={title}
            description={description}
            videoFile={videoFile}
            thumbnailFile={thumbnailFile}
            selectedChapter={selectedChapter}
            selectedSubchapter={selectedSubchapter}
            isUploading={isUploading}
            isCompressing={isCompressing}
            uploadProgress={uploadProgress}
            compressionProgress={compressionProgress}
            originalSize={originalSize}
            compressedSize={compressedSize}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onVideoSelect={(e) => handleFileChange(e, 'video')}
            onThumbnailSelect={(e) => handleFileChange(e, 'thumbnail')}
            onChapterChange={setSelectedChapter}
            onSubchapterChange={setSelectedSubchapter}
            onSubmit={handleSubmit}
            onThumbnailRemove={() => setThumbnailFile(null)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Videos;