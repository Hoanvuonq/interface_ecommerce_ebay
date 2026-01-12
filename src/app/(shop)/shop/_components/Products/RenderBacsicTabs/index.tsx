import React, { useRef } from "react";
import { 
  Trash2, 
  Image as ImageIcon, 
  Plus, 
  Check, 
  PlayCircle, 
  Loader2 
} from "lucide-react";
import { UploadFile } from "@/app/(main)/orders/_types/review";
import { EmptyProductState } from "@/app/(main)/products/_components/EmptyProductState";

interface RenderBasicTabProps {
  // Data props
  name: string;
  active: boolean;
  categoryId: string;
  categoryPath: string;
  fileList: UploadFile[];
  videoList: UploadFile[];

  // Actions
  setBasicInfo: (field: keyof Pick<ProductState, 'name' | 'active'>, value: any) => void;
  onOpenCategoryModal: () => void;
  onUploadImage: (options: { file: File; onSuccess: any; onError: any }) => void;
  onRemoveImage: (file: UploadFile) => void;
  onUploadVideo: (options: { file: File; onSuccess: any; onError: any }) => void;
  onRemoveVideo: (file: UploadFile) => void;
}

export const RenderBasicTab: React.FC<RenderBasicTabProps> = ({
  name,
  active,
  categoryPath,
  fileList,
  videoList,
  setBasicInfo,
  onOpenCategoryModal,
  onUploadImage,
  onRemoveImage,
  onUploadVideo,
  onRemoveVideo,
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Xử lý khi chọn file ảnh từ input hidden
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach((file) => {
        // Mock các hàm callback của antd upload để tái sử dụng logic hook cũ
        onUploadImage({
          file,
          onSuccess: () => {},
          onError: () => {},
        });
      });
    }
    // Reset value để chọn lại cùng 1 file được
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  // Xử lý khi chọn file video
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onUploadVideo({
        file,
        onSuccess: () => {},
        onError: () => {},
      });
    }
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* CARD 1: Thông tin cơ bản */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin cơ bản</h3>
        
        <div className="flex flex-col gap-4">
          {/* Tên sản phẩm */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setBasicInfo('name', e.target.value)}
              placeholder="Nhập tên sản phẩm..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              maxLength={120}
            />
            <div className="text-xs text-right text-gray-400">{name.length}/120</div>
          </div>

          {/* Ngành hàng */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Ngành hàng <span className="text-red-500">*</span>
            </label>
            <div 
              onClick={onOpenCategoryModal}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-pointer hover:bg-white hover:border-blue-400 transition-colors flex justify-between items-center group"
            >
              <span className={categoryPath ? "text-gray-900" : "text-gray-400"}>
                {categoryPath || "Chọn ngành hàng"}
              </span>
              <span className="text-gray-400 group-hover:text-blue-500">✎</span>
            </div>
          </div>

          {/* Trạng thái Switch */}
          <div className="flex items-center justify-between py-2">
            <label className="text-sm font-medium text-gray-700">Trạng thái hoạt động</label>
            <button
              type="button"
              onClick={() => setBasicInfo('active', !active)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                active ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  active ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* CARD 2: Hình ảnh sản phẩm */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Hình ảnh sản phẩm <span className="text-red-500">*</span>
        </h3>
        
        {/* Grid Images */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {fileList.map((file, index) => (
            <div key={file.uid} className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <img
                src={file.url}
                alt={file.name}
                className={`w-full h-full object-cover transition-opacity ${
                  (file as any).processing ? 'opacity-50 grayscale' : 'opacity-100'
                }`}
              />
              
              {/* Processing Overlay */}
              {(file as any).processing && (
                <div className="absolute inset-0 flex items-center justify-center">
                   <Loader2 className="animate-spin text-blue-500" />
                </div>
              )}

              {/* Badge Ảnh Chính */}
              {index === 0 && !(file as any).processing && (
                <div className="absolute top-1 left-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold shadow-sm">
                  Chính
                </div>
              )}

              {/* Actions Overlay (Hover) */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                 <button 
                    onClick={() => onRemoveImage(file)}
                    className="p-1.5 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors"
                    title="Xóa"
                 >
                   <Trash2 size={16} />
                 </button>
              </div>
            </div>
          ))}

          {/* Upload Button Box */}
          {fileList.length < 9 && (
            <div 
              onClick={() => imageInputRef.current?.click()}
              className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all text-gray-400 hover:text-blue-500"
            >
              <ImageIcon size={32} strokeWidth={1.5} />
              <span className="text-xs mt-2 font-medium">Thêm ảnh</span>
              <span className="text-[10px] mt-1 opacity-70">({fileList.length}/9)</span>
              <input 
                type="file" 
                ref={imageInputRef} 
                className="hidden" 
                accept="image/png,image/jpeg,image/jpg" 
                multiple 
                onChange={handleImageFileChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* CARD 3: Video sản phẩm */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Video sản phẩm</h3>
        <p className="text-sm text-gray-500 mb-4">Video giúp khách hàng hình dung rõ hơn về sản phẩm.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {videoList.map((file) => (
               <div key={file.uid} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 bg-black">
                 <video src={file.url} className="w-full h-full object-cover opacity-80" />
                 <div className="absolute inset-0 flex items-center justify-center text-white pointer-events-none">
                    {(file as any).processing ? <Loader2 className="animate-spin" /> : <PlayCircle size={32} />}
                 </div>
                 <button 
                    onClick={() => onRemoveVideo(file)}
                    className="absolute top-1 right-1 p-1 bg-white/80 rounded-full text-red-500 hover:bg-white transition-colors z-10"
                 >
                   <Trash2 size={14} />
                 </button>
               </div>
            ))}

            {videoList.length < 1 && (
              <div 
                onClick={() => videoInputRef.current?.click()}
                className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all text-gray-400 hover:text-blue-500"
              >
                <PlayCircle size={32} strokeWidth={1.5} />
                <span className="text-xs mt-2 font-medium">Thêm video</span>
                <input 
                  type="file" 
                  ref={videoInputRef} 
                  className="hidden" 
                  accept="video/*" 
                  onChange={handleVideoFileChange}
                />
              </div>
            )}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-100 text-blue-800 text-xs">
          <ul className="list-disc pl-4 space-y-1">
             <li>Kích thước tối đa: 30MB</li>
             <li>Định dạng: MP4</li>
          </ul>
        </div>
      </div>
    </div>
  );
};