"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "@/app/admin/actions";

const initialState: ActionState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <label className="block">
        <span className="text-[9px] uppercase tracking-[0.4em] text-white/40 font-black block mb-3">
          Password
        </span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className="w-full bg-transparent border-b-2 border-white/15 focus:border-[#C56E3D] outline-none py-3 text-lg font-medium tracking-wide transition-colors"
        />
      </label>

      {state.error && (
        <p className="text-[11px] uppercase tracking-widest text-[#FF6B6B] font-black">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-[#C56E3D] hover:bg-[#A64D32] disabled:opacity-40 disabled:cursor-not-allowed text-white px-10 py-4 rounded-full text-[10px] uppercase tracking-[0.6em] font-black transition-colors"
      >
        {pending ? "Verifying..." : "Enter"}
      </button>
    </form>
  );
}
