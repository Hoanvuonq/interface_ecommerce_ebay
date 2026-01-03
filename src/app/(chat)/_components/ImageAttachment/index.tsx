"use client";

import React, { useState } from "react";
import _ from "lodash";
import { 
  Maximize2, 
  Download, 
  AlertCircle, 
  Loader2 
} from "lucide-react"; 

interface MessageAttachmentResponse {
  fileUrl: string;
  fileName?: string;
}

interface ImageAttachmentProps {
  attachment: MessageAttachmentResponse;
  maxWidth?: number;
  maxHeight?: number;
}

export const ImageAttachment: React.FC<ImageAttachmentProps> = ({
  attachment,
  maxWidth = 220,
  maxHeight = 220,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleDownload = async () => {
    const fileUrl = _.get(attachment, 'fileUrl');
    const fileName = _.get(attachment, 'fileName', 'image.jpg');

    if (!fileUrl) return;

    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download image:", err);
    }
  };

  const containerStyle: React.CSSProperties = {
    marginTop: 8,
    position: "relative",
    width: "fit-content",
  };

  const placeholderStyle: React.CSSProperties = {
    width: maxWidth,
    height: maxHeight,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f3f4f6", // gray-100
    borderRadius: 8,
    border: "1px solid #e5e7eb", // gray-200
  };

  return (
    <div style={containerStyle}>
      {/* Loading State */}
      {loading && !error && (
        <div style={placeholderStyle}>
          <Loader2 className="animate-spin text-gray-400" size={24} />
        </div>
      )}

      {/* Error State */}
      {error ? (
        <div style={{ ...placeholderStyle, flexDirection: "column", gap: 8 }}>
          <AlertCircle className="text-red-400" size={24} />
          <span style={{ fontSize: 12, color: "#9ca3af" }}>Không thể tải ảnh</span>
        </div>
      ) : (
        <div className="group relative overflow-hidden rounded-lg cursor-pointer">
          <img
            src={attachment.fileUrl}
            alt={attachment.fileName || "Image"}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
            style={{
              maxWidth: maxWidth,
              maxHeight: maxHeight,
              display: loading ? "none" : "block",
              borderRadius: 8,
              objectFit: "cover",
              transition: "transform 0.3s ease",
            }}
            className="hover:scale-105"
          />

          {/* Hover Overlay - Thay thế cho mask của Ant Design Preview */}
          {!loading && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button 
                onClick={() => window.open(attachment.fileUrl, '_blank')}
                className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
                title="Xem ảnh"
              >
                <Maximize2 size={18} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
                className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
                title="Tải xuống"
              >
                <Download size={18} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* File Name Footer */}
      {!loading && !error && attachment.fileName && (
        <div
          style={{
            marginTop: 4,
            fontSize: 11,
            color: "#6b7280", // gray-500
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: maxWidth,
          }}
        >
          {_.truncate(attachment.fileName, { length: 30 })}
        </div>
      )}
    </div>
  );
};
