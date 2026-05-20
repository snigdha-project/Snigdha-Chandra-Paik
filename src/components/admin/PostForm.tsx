"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef } from "react";
import {
  createPostAction,
  updatePostAction,
  type ActionState,
} from "@/app/admin/actions";
import {
  Field,
  FormStatus,
  SubmitButton,
  fieldInput,
  fieldTextarea,
} from "./FormShell";

const initialState: ActionState = {};

export type PostFormInitial = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  date: string;
  excerpt: string;
  content: string;
  imageUrl: string;
};

export default function PostForm({ initial }: { initial?: PostFormInitial }) {
  const isEdit = Boolean(initial);
  const action = isEdit ? updatePostAction : createPostAction;

  const [state, formAction, pending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok && !isEdit) formRef.current?.reset();
  }, [state.ok, isEdit]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      {isEdit && initial && (
        <input type="hidden" name="original_slug" value={initial.slug} />
      )}

      <Field label="Title">
        <input
          name="title"
          required
          defaultValue={initial?.title ?? ""}
          className={fieldInput}
          placeholder="WordPress vs Webflow 2026"
        />
      </Field>

      <Field
        label="Slug"
        hint="Optional. Auto-generated from title if empty. Becomes /blogs/<slug>."
      >
        <input
          name="slug"
          defaultValue={initial?.slug ?? ""}
          className={fieldInput}
          placeholder="wordpress-vs-webflow-2026"
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Category">
          <input
            name="category"
            required
            defaultValue={initial?.category ?? ""}
            className={fieldInput}
            placeholder="TECH"
          />
        </Field>

        <Field label="Date">
          <input
            name="date"
            type="date"
            required
            defaultValue={initial?.date ?? today}
            className={fieldInput}
          />
        </Field>
      </div>

      <Field label="Meta title" hint="Optional. SEO title; falls back to title.">
        <input
          name="meta_title"
          defaultValue={initial?.metaTitle ?? ""}
          className={fieldInput}
        />
      </Field>

      <Field
        label="Meta description"
        hint="Optional. SEO description; falls back to excerpt."
      >
        <input
          name="meta_description"
          defaultValue={initial?.metaDescription ?? ""}
          className={fieldInput}
        />
      </Field>

      <Field label="Excerpt" hint="Shown on listing pages.">
        <textarea
          name="excerpt"
          required
          rows={3}
          defaultValue={initial?.excerpt ?? ""}
          className={fieldTextarea}
        />
      </Field>

      <Field
        label="Cover image"
        hint={
          isEdit
            ? "Leave empty to keep the current image. Upload to replace."
            : "JPG/PNG/WebP. Stored in Supabase Storage."
        }
      >
        {isEdit && initial && (
          <div className="mb-3 inline-flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="relative w-24 h-16 overflow-hidden rounded-md bg-black/40">
              <Image
                src={initial.imageUrl}
                alt="Current cover"
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-black">
              Current
            </span>
          </div>
        )}
        <input
          name="image"
          type="file"
          accept="image/*"
          required={!isEdit}
          className="block text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:uppercase file:tracking-[0.3em] file:font-black file:bg-[#C56E3D] file:text-white hover:file:bg-[#A64D32]"
        />
      </Field>

      <Field
        label="Content (HTML)"
        hint="Full post body. Same HTML format as your existing posts."
      >
        <textarea
          name="content"
          required
          rows={16}
          defaultValue={initial?.content ?? ""}
          className={fieldTextarea}
          placeholder="<p>In 2026, the choice between WordPress and Webflow...</p>"
        />
      </Field>

      <div className="flex items-center justify-between gap-6 pt-2">
        <FormStatus error={state.error} message={state.message} ok={state.ok} />
        <SubmitButton
          pending={pending}
          label={isEdit ? "Save changes" : "Publish post"}
        />
      </div>
    </form>
  );
}
