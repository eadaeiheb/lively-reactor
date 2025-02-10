
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";
import TextElementCard from "./TextElementCard";
import ImageCard from "./ImageCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { products } from "@/config/products";
import { productSidesConfigs } from "../config/productSidesConfig";

interface DesignPreviewProps {
  design: any;
  onDownloadText: (text: any) => void;
  onDownloadImage: (imageUrl: string, imageName: string) => void;
}

const DesignPreview = ({ design, onDownloadText, onDownloadImage }: DesignPreviewProps) => {
  // Check for corrupted or empty design
  if (!design || !design.canvasImage || !design.productId || !design.faceId) {
    return null;
  }

  const textElements = design.textElements || [];
  const uploadedImages = design.uploadedImages || [];
  
  // Find the product details
  const product = products.find(p => p.id === design.productId);
  if (!product) return null; // Skip if product not found

  // Find the product side configuration
  const productConfig = productSidesConfigs.find(config => config.id === design.productId);
  const side = productConfig?.sides.find(side => side.id === design.faceId);
  if (!side) return null; // Skip if side configuration not found
  
  const sideName = side.title || design.faceId;

  return (
    <Card className="p-6 mb-6 border-none shadow-lg bg-white/80 backdrop-blur-sm">
      <div className="space-y-4 mb-6">
        <h3 className="text-xl font-semibold text-primary">
          Design - {sideName}
        </h3>
        
        {/* Product Information */}
        <div className="space-y-2 text-sm text-gray-600">
          <p><span className="font-medium">Produit:</span> {product.name || design.productName}</p>
          <p><span className="font-medium">Couleur sélectionnée:</span> {design.selectedColor}</p>
          {product.description && (
            <p className="text-xs italic">{product.description}</p>
          )}
        </div>
      </div>
      
      <div className="aspect-video w-full relative rounded-lg overflow-hidden border mb-6 bg-white shadow-inner">
        <img 
          src={design.canvasImage} 
          alt={`Design ${sideName}`}
          className="w-full h-full object-contain"
        />
      </div>

      {textElements.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium mb-4 text-primary flex items-center gap-2">
            <span className="p-1 rounded-full bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </span>
            Éléments de texte
          </h4>
          <div className="grid gap-4">
            {textElements.map((text: any, index: number) => (
              <TextElementCard 
                key={index} 
                text={text} 
                onDownload={() => onDownloadText(text)}
              />
            ))}
          </div>
        </div>
      )}

      {uploadedImages.length > 0 && (
        <div>
          <h4 className="font-medium mb-4 text-primary flex items-center gap-2">
            <span className="p-1 rounded-full bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </span>
            Images
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {uploadedImages.map((image: any, index: number) => (
              <ImageCard
                key={index}
                image={image}
                onDownload={onDownloadImage}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default DesignPreview;
