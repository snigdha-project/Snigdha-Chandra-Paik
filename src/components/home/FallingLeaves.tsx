"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

const leafSvg = (fill: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="${fill}" d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/></svg>`,
  )}`;

const LEAF_COLORS = ["#6B8F4E", "#8AA85F", "#A64D32", "#C56E3D"];

export default function FallingLeaves() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      fpsLimit: 40,
      detectRetina: true,
      particles: {
        number: { value: 22, density: { enable: true, width: 1200, height: 900 } },
        opacity: { value: { min: 0.35, max: 0.7 } },
        size: { value: { min: 10, max: 20 } },
        rotate: {
          value: { min: 0, max: 360 },
          direction: "random",
          animation: { enable: true, speed: 6 },
        },
        move: {
          enable: true,
          direction: "bottom",
          speed: { min: 0.6, max: 1.6 },
          straight: false,
          random: true,
          outModes: { default: "out" },
        },
        wobble: { enable: true, distance: 25, speed: { min: 2, max: 6 } },
        shape: {
          type: "image",
          options: {
            image: LEAF_COLORS.map((c) => ({
              src: leafSvg(c),
              width: 24,
              height: 24,
            })),
          },
        },
      },
    }),
    [],
  );

  if (!ready) return null;

  return (
    <Particles
      id="falling-leaves"
      options={options}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}
