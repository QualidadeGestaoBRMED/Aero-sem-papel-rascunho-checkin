import type { FileValue } from "./form-schema";

export const MAX_FILE_BYTES = 10 * 1024 * 1024;

export function readFileAsDataUrl(file: File): Promise<FileValue> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error("read failed"));
    reader.onload = () =>
      resolve({ name: file.name, type: file.type, dataUrl: String(reader.result) });
    reader.readAsDataURL(file);
  });
}

export function isAccepted(file: File, accept: string): boolean {
  return accept.split(",").some((pattern) => {
    const rule = pattern.trim();
    if (rule.endsWith("/*")) return file.type.startsWith(rule.slice(0, -1));
    return file.type === rule;
  });
}

export const isImage = (value: FileValue) => value.type.startsWith("image/");
