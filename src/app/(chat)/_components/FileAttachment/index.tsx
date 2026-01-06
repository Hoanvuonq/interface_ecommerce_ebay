"use client";

import React, { useState } from "react";
import _ from "lodash";
import { 
  Download, 
  Eye, 
  Loader2, 
  FileText, 
  FileCode, 
  FileArchive, 
  FileSpreadsheet, 
  File as FileIcon, 
  FilePieChart 
} from "lucide-react";
import { MessageAttachmentResponse } from "../../_types/chat.dto";

interface FileAttachmentProps {
  attachment: MessageAttachmentResponse;
  onDownload?: (attachment: MessageAttachmentResponse) => void;
}

export const FileAttachment: React.FC<FileAttachmentProps> = ({
  attachment,
  onDownload,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const fileName = _.get(attachment, "fileName", "File");
  const fileUrl = _.get(attachment, "fileUrl", "");
  const fileSize = _.get(attachment, "fileSize", 0);
  const mimeType = _.get(attachment, "mimeType", "");

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const getFileInfo = () => {
    const ext = _.toLower(_.last(_.split(fileName, ".")));
    switch (ext) {
      case "pdf":
        return { Icon: FileText, iconClass: "text-red-500", color: "bg-red-50", border: "border-red-100" };
      case "doc":
      case "docx":
        return { Icon: FileIcon, iconClass: "text-blue-500", color: "bg-blue-50", border: "border-blue-100" };
      case "xls":
      case "xlsx":
      case "csv":
        return { Icon: FileSpreadsheet, iconClass: "text-green-500", color: "bg-green-50", border: "border-green-100" };
      case "ppt":
      case "pptx":
        return { Icon: FilePieChart, iconClass: "text-orange-500", color: "bg-orange-50", border: "border-orange-100" };
      case "zip":
      case "rar":
      case "7z":
        return { Icon: FileArchive, iconClass: "text-purple-500", color: "bg-purple-50", border: "border-purple-100" };
      case "txt":
        return { Icon: FileCode, iconClass: "text-slate-500", color: "bg-slate-50", border: "border-slate-100" };
      default:
        return { Icon: FileIcon, iconClass: "text-gray-500", color: "bg-gray-50", border: "border-gray-100" };
    }
  };

  const { Icon, iconClass, color, border } = getFileInfo();

  const handleDownload = async () => {
    if (onDownload) {
      onDownload(attachment);
      return;
    }

    try {
      setDownloading(true);
      setDownloadProgress(0);

      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Failed");

      const total = _.toNumber(response.headers.get("content-length")) || 0;
      const reader = response.body?.getReader();
      if (!reader) return;

      const chunks: Uint8Array[] = [];
      let receivedLength = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        // Ensure value is a standard Uint8Array
        chunks.push(new Uint8Array(value));
        receivedLength += value.length;
        if (total > 0) {
          setDownloadProgress(_.round((receivedLength / total) * 100));
        }
      }

      const blob = new Blob(chunks.map(chunk => new Uint8Array(chunk)));
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setDownloading(false);
    }
  };

  const handlePreview = () => window.open(fileUrl, "_blank");

  return (
    <div className={itemContainerClasses(color, border)}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="p-2 bg-white rounded-xl shadow-sm shrink-0">
          <Icon size={24} className={iconClass} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div 
            className="font-semibold text-sm text-slate-800 truncate" 
            title={fileName}
          >
            {fileName}
          </div>
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-2">
            <span>{formatFileSize(fileSize)}</span>
            {mimeType && (
              <>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span>{_.toUpper(_.last(_.split(mimeType, "/")))}</span>
              </>
            )}
          </div>
          
          {downloading && (
            <div className="mt-2 w-full bg-slate-200 rounded-full h-1 overflow-hidden">
              <div 
                className="bg-blue-500 h-full transition-all duration-300" 
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 ml-4">
        {["pdf", "txt", "csv"].includes(_.toLower(_.last(_.split(fileName, "."))) || "") && (
          <button
            onClick={handlePreview}
            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            title="Xem trước"
          >
            <Eye size={18} />
          </button>
        )}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="p-2 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
          title="Tải xuống"
        >
          {downloading ? (
            <Loader2 size={18} className="animate-spin text-blue-500" />
          ) : (
            <Download size={18} />
          )}
        </button>
      </div>
    </div>
  );
};

const itemContainerClasses = (color: string, border: string) => `
  mt-2 p-3 rounded-2xl border transition-all duration-200 
  flex items-center justify-between max-w-[360px] group
  ${color} ${border} hover:shadow-md hover:bg-white
`;
