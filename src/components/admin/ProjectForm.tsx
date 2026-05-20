"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef } from "react";
import {
  createProjectAction,
  updateProjectAction,
  type ActionState,
} from "@/app/admin/actions";
import colors from "@/data/colors.json";
import {
  Field,
  FormStatus,
  SubmitButton,
  fieldInput,
  fieldTextarea,
} from "./FormShell";

const initialState: ActionState = {};

export type ProjectFormInitial = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tech: string[];
  link: string | null;
  featured: boolean;
  colorKey: string | null;
  caseStudy: string;
  metaTitle: string;
  metaDescription: string;
  orderIndex: number;
  imageUrl: string;
};

export default function ProjectForm({
  initial,
}: {
  initial?: ProjectFormInitial;
}) {
  const isEdit = Boolean(initial);
  const action = isEdit ? updateProjectAction : createProjectAction;

  const [state, formAction, pending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Only auto-reset on create — editors usually want to keep tweaking.
    if (state.ok && !isEdit) formRef.current?.reset();
  }, [state.ok, isEdit]);

  const colorKeys = Object.keys(colors);

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
          placeholder="AMJ Mechanical"
        />
      </Field>

      <Field
        label="Slug"
        hint="Optional. Lowercase, no spaces. Auto-generated from title if empty."
      >
        <input
          name="slug"
          defaultValue={initial?.slug ?? ""}
          className={fieldInput}
          placeholder="amj-mechanical"
        />
      </Field>

      <Field label="Short description">
        <textarea
          name="description"
          required
          rows={3}
          defaultValue={initial?.description ?? ""}
          className={fieldTextarea}
          placeholder="A high-performance SaaS platform built with Webflow..."
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Category">
          <input
            name="category"
            required
            defaultValue={initial?.category ?? ""}
            className={fieldInput}
            placeholder="SaaS / Automation"
          />
        </Field>

        <Field label="Color key" hint="Optional. Used for visual accents.">
          <select
            name="color_key"
            defaultValue={initial?.colorKey ?? ""}
            className={fieldInput}
          >
            <option value="">— none —</option>
            {colorKeys.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Tech" hint="Comma-separated, e.g. Webflow, SEO, UI/UX">
        <input
          name="tech"
          defaultValue={initial?.tech.join(", ") ?? ""}
          className={fieldInput}
          placeholder="Webflow, SEO, UI/UX"
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="External link" hint="Optional. Full https:// URL.">
          <input
            name="link"
            type="url"
            defaultValue={initial?.link ?? ""}
            className={fieldInput}
            placeholder="https://example.com"
          />
        </Field>

        <Field label="Order index" hint="Lower = shown first.">
          <input
            name="order_index"
            type="number"
            defaultValue={initial?.orderIndex ?? 0}
            className={fieldInput}
          />
        </Field>
      </div>

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={initial?.featured ?? false}
          className="w-4 h-4 accent-[#C56E3D]"
        />
        <span className="text-[10px] uppercase tracking-[0.4em] text-white/60 font-black">
          Featured on home page
        </span>
      </label>

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
        label="Case study (HTML)"
        hint="Optional. If provided, a /projects/<slug> case-study page is generated."
      >
        <textarea
          name="case_study"
          rows={10}
          defaultValue={initial?.caseStudy ?? ""}
          className={fieldTextarea}
          placeholder="<h2>The brief</h2><p>...</p>"
        />
      </Field>

      <Field
        label="Case study meta title"
        hint="Optional. SEO <title> for the case-study page; falls back to the project title."
      >
        <input
          name="meta_title"
          defaultValue={initial?.metaTitle ?? ""}
          className={fieldInput}
          placeholder="AMJ Mechanical — Case Study"
        />
      </Field>

      <Field
        label="Case study meta description"
        hint="Optional. SEO description for the case-study page; falls back to the short description."
      >
        <textarea
          name="meta_description"
          rows={2}
          defaultValue={initial?.metaDescription ?? ""}
          className={fieldTextarea}
          placeholder="How we rebuilt the AMJ Mechanical platform..."
        />
      </Field>

      <div className="flex items-center justify-between gap-6 pt-2">
        <FormStatus error={state.error} message={state.message} ok={state.ok} />
        <SubmitButton
          pending={pending}
          label={isEdit ? "Save changes" : "Publish project"}
        />
      </div>
    </form>
  );
}
