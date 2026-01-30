import { BannerResponseDTO } from "@/app/(main)/(home)/_types/banner.dto";

export type DeviceUploadVariant = "desktop" | "mobile";

export interface UploadStateConfig {
  preview: string | null;
  setPreview: (value: string | null) => void;
  localPreviewUrl: string | null;
  setLocalPreviewUrl: (value: string | null) => void;
  serverImageUrl: string | null;
  setServerImageUrl: (value: string | null) => void;
  uploadProgress: number;
  setUploadProgress: (value: number) => void;
  formField: "mediaAssetId" | "mediaDesktopId" | "mediaMobileId";
}

export interface ResponsiveUploadConfig {
  variant: DeviceUploadVariant;
  title: string;
  description: string;
  icon: React.ReactNode;
}
export interface BannerFormProps {
  banner?: BannerResponseDTO | null;
  open: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}