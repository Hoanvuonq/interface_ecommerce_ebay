import { X } from "lucide-react";

export const CustomVideoModal: React.FC<any> = ({ open, videoUrl, onCancel }) => {
  if (!open || !videoUrl) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-[1050] flex justify-center items-center p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh]">
        <button
          onClick={onCancel}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition"
          aria-label="Đóng video"
        >
          <X className="w-8 h-8" />
        </button>
        <video
          src={videoUrl}
          controls
          autoPlay
          className="w-full h-auto max-h-[80vh] rounded-xl shadow-2xl"
          style={{ background: "black" }}
        />
      </div>
    </div>
  );
};