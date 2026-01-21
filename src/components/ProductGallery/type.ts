export interface GalleryItem {
  key: string;
  preview: string;
  thumb: string;
}

export interface ProductGalleryProps {
  product: any;
  galleryImages?: GalleryItem[]; 
  media?: any[];               
  activeImg?: string; 
  onThumbnailClick?: (preview: string, key: string) => void;
  onZoomClick?: (image: string) => void;
}
