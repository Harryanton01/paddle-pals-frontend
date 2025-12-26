import clsx from "clsx";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className={clsx("shrink-0", className)} // shrink-0 prevents squishing
    >
      {/* Background: Teal Rounded Square */}
      <rect x="0" y="0" width="512" height="512" rx="128" fill="#0D9488" />

      {/* The Trajectory Path */}
      <path
        d="M 96 384 C 96 384, 160 384, 192 320 C 224 256, 256 192, 256 192 C 256 192, 288 288, 320 320 C 352 352, 416 128, 416 128"
        stroke="white"
        strokeWidth="32"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* The Ball */}
      <circle cx="416" cy="128" r="40" fill="white" />

      {/* Optional Glow */}
      <circle cx="416" cy="128" r="60" fill="white" opacity="0.2" />
    </svg>
  );
};
