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

interface VideosProps {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

const MAX_TOTAL_SIZE = 400 * 1024 * 1024; // 400MB in bytes

const Videos: React.FC<VideosProps> = ({ user }) => {
  const [enableCompression, setEnableCompression] = React.useState(true);
  const [totalFileSize, setTotalFileSize] = React.useState(0);
  const { toast } = useToast();

  const {
    isCompressing,
    originalSize,
    compressedSize,
    compressionProgress,
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

    if (newTotalSize > MAX_TOTAL_SIZE && !enableCompression) {
      setEnableCompression(true);
      toast({
        title: "Compression automatique activée",
        description: `La taille totale des fichiers (${formatFileSize(newTotalSize)}) dépasse 400MB. La compression a été activée automatiquement.`,
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

    if (newTotalSize > MAX_TOTAL_SIZE && !enableCompression) {
      setEnableCompression(true);
      toast({
        title: "Compression automatique activée",
        description: `La taille totale des fichiers (${formatFileSize(newTotalSize)}) dépasse 400MB. La compression a été activée automatiquement.`,
        duration: 5000,
      });
    }

    if (enableCompression || newTotalSize > MAX_TOTAL_SIZE) {
      const compressedFile = await handleFileCompression(file, type);
      if (compressedFile) {
        if (type === 'video') {
          setVideoFile(compressedFile);
        } else {
          setThumbnailFile(compressedFile);
        }
      }
    } else {
      const fileWithPreview = Object.assign(file, {
        preview: type === 'thumbnail' ? URL.createObjectURL(file) : undefined
      });

      if (type === 'video') {
        setVideoFile(fileWithPreview);
      } else {
        setThumbnailFile(fileWithPreview);
      }
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
              <span className="text-sm text-muted-foreground">Compression</span>
              <Switch
                checked={enableCompression}
                onCheckedChange={setEnableCompression}
                disabled={totalFileSize > MAX_TOTAL_SIZE}
              />
            </div>
          </div>

          {totalFileSize > 0 && (
            <Alert variant={totalFileSize > MAX_TOTAL_SIZE ? "destructive" : "default"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Taille totale des fichiers</AlertTitle>
              <AlertDescription>
                {formatFileSize(totalFileSize)}
                {totalFileSize > MAX_TOTAL_SIZE && " - Compression automatique activée"}
              </AlertDescription>
            </Alert>
          )}

          <p className="text-sm text-muted-foreground">
            Partagez votre contenu avec votre audience. Téléchargez des vidéos et personnalisez leurs détails.
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