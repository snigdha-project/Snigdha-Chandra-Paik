"use client";

export const fieldLabel =
  "text-[9px] uppercase tracking-[0.35em] text-white/45 font-black block mb-2";
export const fieldInput =
  "w-full bg-white/[0.03] border border-white/10 focus:border-[#C56E3D] outline-none rounded-lg px-4 py-3 text-sm font-medium tracking-wide transition-colors placeholder:text-white/20";
export const fieldTextarea =
  "w-full bg-white/[0.03] border border-white/10 focus:border-[#C56E3D] outline-none rounded-lg px-4 py-3 text-sm font-medium tracking-wide transition-colors placeholder:text-white/20 leading-relaxed resize-y";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={fieldLabel}>{label}</span>
      {children}
      {hint && (
        <span className="text-[10px] text-white/30 font-medium mt-1.5 block tracking-wide">
          {hint}
        </span>
      )}
    </label>
  );
}

export function FormStatus({
  error,
  message,
  ok,
}: {
  error?: string;
  message?: string;
  ok?: boolean;
}) {
  if (!error && !message) return null;
  return (
    <p
      className={`text-[11px] uppercase tracking-widest font-black ${
        ok ? "text-[#4ADE80]" : "text-[#FF6B6B]"
      }`}
    >
      {ok ? message : error}
    </p>
  );
}

export function SubmitButton({
  pending,
  label,
}: {
  pending: boolean;
  label: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full md:w-auto bg-[#C56E3D] hover:bg-[#A64D32] disabled:opacity-40 disabled:cursor-not-allowed text-white px-10 py-4 rounded-full text-[10px] uppercase tracking-[0.6em] font-black transition-colors"
    >
      {pending ? "Publishing..." : label}
    </button>
  );
}
