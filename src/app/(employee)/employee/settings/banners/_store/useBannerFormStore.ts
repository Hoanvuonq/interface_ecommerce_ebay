import { create } from "zustand";
import {
  DeviceTarget,
  BannerDisplayLocation,
  BannerResponseDTO,
} from "@/app/(main)/(home)/_types/banner.dto";

interface UploadState {
  preview: string | null;
  assetId: string | null;
  progress: number;
}

interface BannerFormState {
  formData: {
    id?: string;
    title: string;
    subtitle: string;
    href: string;
    position: number;
    priority: number;
    active: boolean;
    locale: string;
    deviceTarget: DeviceTarget;
    displayLocation: BannerDisplayLocation;
    categoryId?: string;
    mediaAssetId?: string;
    mediaDesktopId?: string;
    mediaMobileId?: string;
    scheduleStart?: string;
    scheduleEnd?: string;
    version?: number;
  };
  uploads: {
    base: UploadState;
    desktop: UploadState;
    mobile: UploadState;
  };
  isSubmitting: boolean;

  // Actions
  setFormField: (field: string, value: any) => void;
  setFormData: (data: Partial<BannerFormState["formData"]>) => void;
  updateUpload: (
    variant: "base" | "desktop" | "mobile",
    data: Partial<UploadState>,
  ) => void;
  syncFromBanner: (
    banner: BannerResponseDTO,
    previews: {
      base: string | null;
      desktop: string | null;
      mobile: string | null;
    },
  ) => void;
  resetForm: () => void;
  setSubmitting: (val: boolean) => void;
}

const initialUpload = { preview: null, assetId: null, progress: 0 };
const initialFormData = {
  title: "",
  subtitle: "",
  href: "",
  position: 0,
  priority: 0,
  active: true,
  locale: "vi",
  deviceTarget: DeviceTarget.ALL,
  displayLocation: BannerDisplayLocation.HOMEPAGE_HERO,
};

export const useBannerFormStore = create<BannerFormState>((set) => ({
  formData: { ...initialFormData },
  uploads: {
    base: { ...initialUpload },
    desktop: { ...initialUpload },
    mobile: { ...initialUpload },
  },
  isSubmitting: false,

  setFormField: (field, value) =>
    set((state) => ({ formData: { ...state.formData, [field]: value } })),
  setFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
  updateUpload: (variant, data) =>
    set((state) => ({
      uploads: {
        ...state.uploads,
        [variant]: { ...state.uploads[variant], ...data },
      },
    })),
  setSubmitting: (val) => set({ isSubmitting: val }),
  syncFromBanner: (banner, previews) =>
    set({
      formData: {
        id: banner.id,
        title: banner.title ?? "",
        subtitle: banner.subtitle ?? "",
        href: banner.href ?? "",
        position: banner.position ?? 0,
        priority: banner.priority ?? 0,
        active: banner.active ?? true,
        locale: banner.locale ?? "vi",
        deviceTarget: banner.deviceTarget ?? DeviceTarget.ALL,
        displayLocation: banner.displayLocation ?? BannerDisplayLocation.HOMEPAGE_HERO,
        categoryId: banner.categoryId,
        mediaAssetId: banner.mediaAssetId,
        mediaDesktopId: banner.mediaDesktopId,
        mediaMobileId: banner.mediaMobileId,
        scheduleStart: banner.scheduleStart,
        scheduleEnd: banner.scheduleEnd,
        version: banner.version,
      },
      uploads: {
        base: {
          ...initialUpload,
          preview: previews.base,
          assetId: banner.mediaAssetId || null,
        },
        desktop: {
          ...initialUpload,
          preview: previews.desktop,
          assetId: banner.mediaDesktopId || null,
        },
        mobile: {
          ...initialUpload,
          preview: previews.mobile,
          assetId: banner.mediaMobileId || null,
        },
      },
    }),
  resetForm: () =>
    set({
      formData: { ...initialFormData },
      uploads: {
        base: { ...initialUpload },
        desktop: { ...initialUpload },
        mobile: { ...initialUpload },
      },
      isSubmitting: false,
    }),
}));
