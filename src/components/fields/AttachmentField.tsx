"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import type { FieldDef, FileValue } from "@/lib/form-schema";
import { isAccepted, isImage, MAX_FILE_BYTES, readFileAsDataUrl } from "@/lib/files";
import { ui, useLang, type Bilingual } from "@/lib/i18n";
import { CameraCapture } from "../CameraCapture";
import { SecondaryButton } from "../AppChrome";
import { IconCamera, IconCheckCircle, IconFile, IconUpload } from "../icons";

/** Foto de identidade (câmera) e documento digital (arquivo, aceita PDF). */
export function AttachmentControl({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: FileValue | undefined;
  onChange: (value: FileValue | undefined) => void;
}) {
  const { t } = useLang();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"camera" | "file">(
    field.widget === "photo" ? "camera" : "file"
  );
  const [error, setError] = useState<Bilingual | null>(null);

  const accept = field.accept ?? "image/*";

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) return setError(ui.fileTooLarge);
    if (!isAccepted(file, accept)) return setError(ui.fileWrongType);
    setError(null);
    onChange(await readFileAsDataUrl(file));
  };

  return (
    <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pb-2">
      {field.guidance && !value && (
        <ul className="space-y-2 rounded-2xl bg-teal/8 p-4">
          {field.guidance.map((line) => (
            <li
              key={line.pt}
              className="flex items-start gap-2.5 text-[13px] leading-relaxed text-gray-1"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
              {t(line)}
            </li>
          ))}
        </ul>
      )}

      {value ? (
        <AttachmentPreview value={value} onReplace={() => onChange(undefined)} />
      ) : mode === "camera" ? (
        <CameraCapture onCapture={onChange} onUnavailable={() => setMode("file")} />
      ) : (
        <div className="space-y-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-gray-3 bg-paper p-8 text-center transition-colors active:bg-gray-4"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal/10 text-teal">
              <IconUpload className="h-6 w-6" />
            </span>
            <span className="font-display text-[15px] font-medium text-navy">
              {t(ui.chooseFile)}
            </span>
          </motion.button>

          {field.widget === "file" && (
            <SecondaryButton onClick={() => setMode("camera")}>
              <span className="flex items-center justify-center gap-2">
                <IconCamera className="h-5 w-5" />
                {t(ui.cameraStart)}
              </span>
            </SecondaryButton>
          )}
        </div>
      )}

      {error && <p className="text-center text-xs font-normal text-rust">{t(error)}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        capture={field.widget === "photo" ? "user" : undefined}
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function AttachmentPreview({
  value,
  onReplace,
}: {
  value: FileValue;
  onReplace: () => void;
}) {
  const { t } = useLang();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-3"
    >
      {isImage(value) ? (
        <div className="relative overflow-hidden rounded-2xl bg-navy">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value.dataUrl} alt="" className="aspect-[3/4] w-full object-cover" />
          <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-teal text-paper shadow-md">
            <IconCheckCircle className="h-5 w-5" />
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-3.5 rounded-2xl bg-paper p-4 shadow-sm">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal/10 text-teal">
            <IconFile className="h-5 w-5" />
          </span>
          <p className="min-w-0 flex-1 truncate text-[15px] text-navy">{value.name}</p>
          <IconCheckCircle className="h-5 w-5 shrink-0 text-teal" />
        </div>
      )}

      <SecondaryButton onClick={onReplace}>{t(ui.replaceFile)}</SecondaryButton>
    </motion.div>
  );
}
