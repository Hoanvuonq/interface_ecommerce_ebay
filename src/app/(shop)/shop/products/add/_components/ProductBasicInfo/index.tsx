"use client";
import React from 'react';
import { useProductStore } from '@/app/(shop)/shop/_store/product.store';
import { Check, Trash2, PlayCircle, Image as ImageIcon, Info } from 'lucide-react';

interface ProductBasicTabsProps {
  form: any;
  onOpenCategoryModal: () => void;
  onUploadImage: (file: File) => Promise<void>;
  onUploadVideo: (file: File) => Promise<void>;
  onShowImageModal: (file: any) => void;
  onShowVideoModal: (file: any) => void;
}

export const ProductBasicTabs: React.FC<ProductBasicTabsProps> = ({
  form,
  onOpenCategoryModal,
  onUploadImage,
  onUploadVideo,
  onShowImageModal,
  onShowVideoModal,
}) => {
  const {
    name,
    active,
    categoryPath,
    fileList,
    videoList,
    uploading,
    uploadingVideo,
    setBasicInfo,
    setFileList,
    setVideoList
  } = useProductStore();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBasicInfo('name', value);
    form.setFieldValue('name', value);
  };

  const handleActiveChange = (checked: boolean) => {
    setBasicInfo('active', checked);
    form.setFieldValue('active', checked);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (const file of Array.from(files)) {
        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        const allowedExtensions = ['png', 'jpg', 'jpeg'];

        const isValidType = allowedTypes.includes(file.type) || 
          (fileExtension && allowedExtensions.includes(fileExtension));

        if (!isValidType) {
          alert('Chỉ được upload file hình ảnh định dạng PNG, JPG hoặc JPEG!');
          continue;
        }

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          alert('Kích thước file không được vượt quá 2MB!');
          continue;
        }

        await onUploadImage(file);
      }
    }
    e.target.value = ''; // Reset input
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (const file of Array.from(files)) {
        const isVideo = file.type.startsWith('video/');
        if (!isVideo) {
          alert('Chỉ được upload file video!');
          continue;
        }

        const fileSizeMB = file.size / 1024 / 1024;
        const isLt30M = fileSizeMB <= 30;
        if (!isLt30M) {
          alert('Kích thước file video không được vượt quá 30MB!');
          continue;
        }

        await onUploadVideo(file);
      }
    }
    e.target.value = ''; // Reset input
  };

  const handleRemoveImage = (fileUid: string) => {
    setFileList(prev => prev.filter(item => item.uid !== fileUid));
  };

  const handleRemoveVideo = (fileUid: string) => {
    setVideoList(prev => prev.filter(item => item.uid !== fileUid));
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index !== 0) {
      setFileList(prev => {
        const newFileList = [...prev];
        const [movedFile] = newFileList.splice(index, 1);
        newFileList.unshift(movedFile);
        return newFileList;
      });
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Hidden form fields for form validation */}
      <div className="hidden">
        <input type="hidden" name="variants" />
        <input type="hidden" name="options" />
      </div>

      {/* Card 1: Basic Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Thông tin cơ bản
        </h3>

        {/* Product Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên sản phẩm <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Nhập tên sản phẩm"
              maxLength={120}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <div className="absolute right-3 top-3 text-sm text-gray-500">
              {name.length}/120
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ngành hàng <span className="text-red-500">*</span>
          </label>
          <div 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors flex items-center justify-between bg-white"
            onClick={onOpenCategoryModal}
          >
            <span className={categoryPath ? "text-gray-900" : "text-gray-500"}>
              {categoryPath || "Chọn ngành hàng"}
            </span>
            <span className="text-gray-400 text-base">✏️</span>
          </div>
        </div>

        {/* Status Toggle */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trạng thái
          </label>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => handleActiveChange(!active)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                active ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  active ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="ml-3 text-sm text-gray-700">
              {active ? 'Hoạt động' : 'Tạm dừng'}
            </span>
          </div>
        </div>
      </div>

      {/* Card 2: Product Images */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Hình ảnh sản phẩm <span className="text-red-500">*</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
          {fileList.map((file, index) => (
            <div key={file.uid} className="relative group">
              <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                  style={{
                    filter: (file as any).processing ? 'grayscale(40%)' : undefined,
                    opacity: (file as any).processing ? 0.85 : 1,
                  }}
                  onClick={() => onShowImageModal(file)}
                />
                
                {/* Processing overlay */}
                {(file as any).processing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
                    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      <span className="text-xs text-gray-600">Đang xử lý...</span>
                    </div>
                  </div>
                )}

                {/* Primary image badge */}
                {index === 0 && !(file as any).processing && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                    Ảnh chính
                  </div>
                )}

                {/* Delete button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(file.uid);
                  }}
                  disabled={(file as any).processing}
                  className="absolute top-2 right-2 p-1.5 bg-white bg-opacity-90 hover:bg-red-100 rounded-full transition-colors shadow-sm"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              {/* Set primary button */}
              <button
                type="button"
                onClick={() => handleSetPrimaryImage(index)}
                disabled={(file as any).processing}
                className={`mt-2 w-full px-2 py-1.5 text-xs rounded transition-colors flex items-center justify-center gap-1 ${
                  index === 0 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Check className="w-3 h-3" />
                {index === 0 ? 'Ảnh chính' : 'Đặt làm chính'}
              </button>
            </div>
          ))}

          {/* Upload button */}
          {fileList.length < 9 && (
            <div className="relative">
              <input
                type="file"
                multiple
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleImageUpload}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer p-4">
                <ImageIcon className="w-8 h-8 text-blue-500 mb-2" />
                <div className="text-blue-600 font-medium text-sm text-center">
                  Kéo thả hoặc click
                </div>
                <div className="text-gray-500 text-xs text-center mt-1">
                  {fileList.length}/9 ảnh
                </div>
                <div className="text-gray-400 text-xs text-center">
                  PNG, JPG • Max 2MB
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card 3: Product Videos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Video sản phẩm
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Video giúp khách hàng hiểu rõ hơn về sản phẩm của bạn
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
          {videoList.map((file, index) => (
            <div key={file.uid} className="relative group">
              <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-black">
                <video
                  src={file.url}
                  className="w-full h-full object-cover cursor-pointer"
                  style={{
                    filter: (file as any).processing ? 'grayscale(40%)' : undefined,
                    opacity: (file as any).processing ? 0.85 : 1,
                  }}
                  onClick={() => onShowVideoModal(file)}
                />
                
                {/* Processing overlay */}
                {(file as any).processing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm">
                      <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      <span className="text-xs text-gray-600">Đang xử lý...</span>
                    </div>
                  </div>
                )}

                {/* Play icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <PlayCircle className="w-8 h-8 text-white opacity-80" />
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveVideo(file.uid);
                  }}
                  disabled={(file as any).processing}
                  className="absolute top-2 right-2 p-1.5 bg-white bg-opacity-90 hover:bg-red-100 rounded-full transition-colors shadow-sm"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              <div className="mt-2 text-xs text-gray-600 truncate px-1">
                {file.name}
              </div>
            </div>
          ))}

          {/* Video upload button */}
          {videoList.length < 3 && (
            <div className="relative">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                disabled={uploadingVideo}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer p-4">
                <PlayCircle className="w-8 h-8 text-blue-500 mb-2" />
                <div className="text-blue-600 font-medium text-sm">
                  Thêm video
                </div>
                <div className="text-gray-400 text-xs text-center mt-1">
                  MP4 • Max 30MB
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video requirements info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-2">Yêu cầu video:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Kích thước tối đa: 30MB</li>
                <li>• Định dạng: MP4</li>
                <li>• Lưu ý: sản phẩm có thể hiển thị trong khi video đang được xử lý</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};