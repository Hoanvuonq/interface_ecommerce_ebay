import axios from "@/utils/axios.customize";
import type { ApiResponse } from "@/api/_types/api.types";

const API_ENDPOINT = "v1/storage/upload";

type UploadResponse = {
  path: string;
  url: string;
};

export async function uploadImage(
  file: File,
  uploadPath?: string,
): Promise<UploadResponse> {
  const endpoint = `/${API_ENDPOINT}`;
  const form = new FormData();
  form.append("file", file);
  if (uploadPath) form.append("path", uploadPath);
  const res: ApiResponse<UploadResponse> = await axios.post(endpoint, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
