import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

/**
 * Lightweight Font Awesome renderer: draws the icon's SVG path directly, so we
 * don't ship `react-fontawesome` + `svg-core` (~25KB gzipped) for a handful of
 * footer icons. Sizing follows the surrounding font-size, like FontAwesomeIcon.
 */
export default function FaIcon({
  icon,
  className,
}: {
  icon: IconDefinition;
  className?: string;
}) {
  const [width, height, , , path] = icon.icon;
  const paths = Array.isArray(path) ? path : [path];
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${width} ${height}`}
      fill="currentColor"
      className={className}
      style={{
        display: "inline-block",
        height: "1em",
        width: `${width / height}em`,
        verticalAlign: "-0.125em",
        overflow: "visible",
      }}
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
