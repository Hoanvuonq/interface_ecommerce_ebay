import { useCallback, useState } from "react";
import SparkMD5 from "spark-md5";
import { toPublicUrl} from "@/utils/storage/url";
import { storageService } from "@/services/storage/storage.service";
import { UploadContext } from "@/types/storage/storage.types";
import { safeApiCall } from "@/utils/api.helpers";

const calcMd5Hex = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const spark = new SparkMD5.ArrayBuffer();
		const reader = new FileReader();
		const chunkSize = 2 * 1024 * 1024;
		let current = 0;
		const chunks = Math.ceil(file.size / chunkSize);
		reader.onload = (e) => {
			if (e.target?.result) spark.append(e.target.result as ArrayBuffer);
			current++;
			if (current < chunks) loadNext(); else resolve(spark.end());
		};
		reader.onerror = () => reject(new Error("Failed to read file"));
		const loadNext = () => {
			const start = current * chunkSize;
			const end = Math.min(start + chunkSize, file.size);
			reader.readAsArrayBuffer(file.slice(start, end));
		};
		loadNext();
	});
};

const derivePublicOrigPath = (presignPath?: string | null) => {
	if (!presignPath) return "";
	const i = presignPath.lastIndexOf("/");
	if (i < 0) return "";
	const dir = presignPath.substring(0, i);
	const file = presignPath.substring(i + 1);
	const j = file.lastIndexOf(".");
	const name = j >= 0 ? file.substring(0, j) : file;
	const ext = j >= 0 ? file.substring(j) : "";
	return `public/${dir}/${name}_orig${ext}`;
};

export type PresignedUploadResult = {
	assetId: string;
	path: string;
	finalUrl?: string;
	status?: string;
};

export function usePresignedUpload() {
	const [uploading, setUploading] = useState(false);
	const [status, setStatus] = useState<string | undefined>(undefined);

	const pollAssetReady = useCallback(async (assetId: string, presignPath?: string | null, maxAttempts = 20, intervalMs = 2000): Promise<string | undefined> => {
		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			try {
				const resp = await safeApiCall(() => storageService.getStatus({ assetIds: [assetId] }));
				const entry: any = resp ? (resp as any)[assetId] : undefined;
				let s: string | undefined; let pu: string | undefined | null;
				if (typeof entry === 'string') s = entry; else if (entry) { s = entry.status; pu = entry.publicUrl || entry.publicPath; }
				if (s) setStatus(s);
				if (s === 'READY') return pu ? toPublicUrl(pu) : toPublicUrl(derivePublicOrigPath(presignPath));
				if (s === 'FAILED') return undefined;
			} catch {}
			await new Promise(r => setTimeout(r, intervalMs));
		}
		return undefined;
	}, []);

	const uploadFile = useCallback(async (file: File, context: UploadContext): Promise<PresignedUploadResult> => {
		setUploading(true);
		try {
			const md5 = await calcMd5Hex(file);
			const ext0 = file.name.split('.').pop()?.toLowerCase();
			const ext = ext0 === 'jpeg' ? 'jpg' : (ext0 || 'jpg');
		const presign = await safeApiCall(
			() => storageService.presignUpload({ context, extension: ext, fileSizeBytes: file.size, md5 }),
			{ errorMessage: 'Không thể lấy presigned URL' }
		);
			if (!presign) throw new Error('Presign failed');
			const { url, headers, assetId, path } = presign as any;
			const putHeaders: Record<string, string> = {};
			const contentType = headers?.["Content-Type"] ?? headers?.["content-type"] ?? (file.type || 'application/octet-stream');
			const contentMd5 = headers?.["Content-MD5"] ?? headers?.["content-md5"];
			if (contentType) putHeaders["Content-Type"] = contentType;
			if (contentMd5) putHeaders["Content-MD5"] = contentMd5;
			const putRes = await fetch(url, { method: 'PUT', headers: putHeaders, body: file });
			if (!putRes.ok) throw new Error(`PUT failed: ${putRes.status}`);
			const videoContexts = new Set<UploadContext>([
				UploadContext.PRODUCT_VIDEO,
				UploadContext.SHOP_VIDEO,
				UploadContext.REVIEW_VIDEO,
				UploadContext.CHAT_VIDEO,
			]);

			if (videoContexts.has(context)) {
				await safeApiCall(
					() => storageService.preCheckVideos({ assetIds: [assetId] }),
					{ errorMessage: 'Không thể xử lý video' }
				);
			} else {
				await safeApiCall(
					() => storageService.preCheckImages({ assetIds: [assetId] }),
					{ errorMessage: 'Không thể xử lý ảnh' }
				);
			}
			const finalUrl = await pollAssetReady(assetId, path);
			return { assetId, path, finalUrl, status: finalUrl ? 'READY' : status };
		} finally {
			setUploading(false);
		}
	}, [pollAssetReady, status]);

	return { uploading, status, uploadFile };
}
