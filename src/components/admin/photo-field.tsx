"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { describedBy, Field, inputClass } from "@/components/admin/fields";
import { buttonClass } from "@/components/button";
import type { Dictionary } from "@/i18n/dictionaries";
import { createBrowserSupabase } from "@/lib/supabase/browser";

const BUCKET = "activity-images";

/**
 * Foto kiezen en direct uploaden naar Supabase Storage (vanuit de browser,
 * zodat grote foto's niet via de server hoeven). Het formulier krijgt alleen
 * de publieke URL mee in een verborgen veld.
 */
export function PhotoField({
  t,
  initialUrl,
  altNl,
  error,
  onUploadingChange,
}: {
  t: Dictionary["admin"]["form"];
  initialUrl: string;
  altNl?: string;
  error?: string;
  onUploadingChange: (uploading: boolean) => void;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [status, setStatus] = useState<"idle" | "uploading" | "failed">("idle");
  const fileId = useId();

  async function upload(file: File) {
    setStatus("uploading");
    onUploadingChange(true);
    const storage = createBrowserSupabase().storage.from(BUCKET);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await storage.upload(path, file, {
      contentType: file.type,
      cacheControl: "31536000",
    });
    onUploadingChange(false);
    if (error) {
      setStatus("failed");
      return;
    }
    setUrl(storage.getPublicUrl(path).data.publicUrl);
    setStatus("idle");
  }

  return (
    <div className="flex flex-col gap-5">
      <input type="hidden" name="image_url" value={url} />

      <div className="flex flex-wrap items-start gap-5">
        <div className="relative flex aspect-video w-full max-w-[320px] items-center justify-center overflow-hidden rounded-md border border-dashed border-input bg-muted">
          {url ? (
            <Image src={url} alt="" fill sizes="320px" className="object-cover" />
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-10 text-grey-300"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="9" cy="10" r="2" />
              <path d="m21 16-5-5-9 9" />
            </svg>
          )}
          {status === "uploading" && (
            <span className="absolute inset-0 flex items-center justify-center bg-white/80 text-sm font-bold">
              {t.uploading}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor={fileId}
            className={`${buttonClass("ghost")} cursor-pointer has-[:focus-visible]:border-brand`}
          >
            {url ? t.replacePhoto : t.choosePhoto}
            <input
              id={fileId}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={status === "uploading"}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) upload(file);
                event.target.value = "";
              }}
            />
          </label>
          {url && (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="cursor-pointer self-start text-sm font-bold text-danger hover:underline"
            >
              {t.removePhoto}
            </button>
          )}
          <p className="max-w-xs text-sm text-muted-foreground">{t.photoHint}</p>
          {(status === "failed" || error) && (
            <p role="alert" className="text-sm font-semibold text-danger">
              {t.uploadFailed}
            </p>
          )}
        </div>
      </div>

      {url && (
        <Field id="image_alt_nl" label={t.altNl} hint={t.altHint}>
          <input
            {...describedBy("image_alt_nl", undefined, t.altHint)}
            defaultValue={altNl}
            className={inputClass}
          />
        </Field>
      )}
    </div>
  );
}
