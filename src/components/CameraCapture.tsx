"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { FileValue } from "@/lib/form-schema";
import { ui, useLang } from "@/lib/i18n";
import { PrimaryButton, SecondaryButton } from "./AppChrome";
import { IconAlert, IconCamera } from "./icons";

const MAX_SIDE = 1280;
const JPEG_QUALITY = 0.85;

type Status = "starting" | "live" | "unavailable";

/**
 * Câmera in-app com moldura de enquadramento.
 *
 * O preview não é espelhado de propósito: como a pessoa segura o documento
 * ao lado do rosto, espelhar deixaria o texto do documento ilegível e faria
 * a foto salva divergir do que se vê na tela.
 */
export function CameraCapture({
  onCapture,
  onUnavailable,
}: {
  onCapture: (value: FileValue) => void;
  /** Chamado quando não há câmera ou a permissão foi negada. */
  onUnavailable: () => void;
}) {
  const { t } = useLang();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<Status>("starting");
  const [shot, setShot] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      // Toda a API de mídia é tocada só aqui — nunca durante o render, que
      // também roda na pré-renderização do servidor.
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus("unavailable");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setStatus("live");
      } catch {
        if (!cancelled) setStatus("unavailable");
      }
    }

    start();
    return () => {
      cancelled = true;
      stopStream();
    };
  }, [stopStream]);

  const capture = () => {
    const video = videoRef.current;
    if (!video?.videoWidth) return;

    const scale = Math.min(1, MAX_SIDE / Math.max(video.videoWidth, video.videoHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);

    setShot(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
    navigator.vibrate?.(12);
  };

  const confirm = () => {
    if (!shot) return;
    stopStream();
    onCapture({ name: "identidade.jpg", type: "image/jpeg", dataUrl: shot });
  };

  if (status === "unavailable") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-paper p-6 text-center shadow-sm">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber/10 text-amber">
          <IconAlert className="h-6 w-6" />
        </span>
        <p className="text-sm leading-relaxed text-gray-1">{t(ui.cameraDenied)}</p>
        <SecondaryButton onClick={onUnavailable}>{t(ui.chooseFile)}</SecondaryButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-navy">
        {shot ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={shot} alt="" className="h-full w-full object-cover" />
        ) : (
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className="h-full w-full object-cover"
          />
        )}

        {!shot && (
          <>
            {/* Máscara: o box-shadow gigante escurece tudo fora do oval. */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[62%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-2 border-dashed border-paper/70"
              style={{ boxShadow: "0 0 0 9999px rgba(25, 59, 79, 0.45)" }}
            />
            <p className="absolute inset-x-0 bottom-4 text-center text-[13px] font-light text-paper/90">
              {status === "starting" ? t(ui.cameraLoading) : t(ui.cameraTitle)}
            </p>
          </>
        )}
      </div>

      {shot ? (
        <div className="flex gap-3">
          <SecondaryButton onClick={() => setShot(null)}>{t(ui.cameraRetake)}</SecondaryButton>
          <PrimaryButton onClick={confirm}>{t(ui.cameraUse)}</PrimaryButton>
        </div>
      ) : (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={capture}
          disabled={status !== "live"}
          className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-navy font-display text-base font-medium text-paper shadow-lg shadow-navy/25 transition-opacity disabled:opacity-40"
        >
          <IconCamera className="h-5 w-5" />
          {t(ui.cameraCapture)}
        </motion.button>
      )}
    </div>
  );
}
