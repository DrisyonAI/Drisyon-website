import Image from "next/image";

/**
 * The official DRISYON logo, presented as a horizontal lockup made from the supplied artwork
 * (mark + wordmark are cropped from the original file, never redrawn).
 * Motion: an elegant CSS reveal on load, a slow light sweep across the mark and a gentle hover lift.
 */
export function Logo({
  height = 44,
  tone = "dark",
  animate = true,
  className = "",
  poweredBy = false,
}: {
  height?: number;
  tone?: "dark" | "light";
  animate?: boolean;
  className?: string;
  /** Adds the "powered by Brain O Vision" line under the wordmark */
  poweredBy?: boolean;
}) {
  const markW = Math.round(height * (493 / 678));
  const wordH = Math.round(height * 0.44);
  const wordW = Math.round(wordH * (666 / 187));
  const lift = "transition-transform duration-700 ease-out-soft group-hover/logo:-translate-y-[2px] group-hover/logo:scale-[1.04]";

  return (
    <span className={`group/logo relative inline-flex items-end gap-[0.3em] ${className}`} style={{ fontSize: height }}>
      <span className={`relative block shrink-0 transition-[width,height] duration-500 ${animate ? "logo-mark-in" : ""}`} style={{ width: markW, height }}>
        {/* soft energy behind the mark, revealed on hover */}
        <span
          aria-hidden="true"
          className="absolute -inset-[30%] rounded-full opacity-0 blur-xl transition-opacity duration-700 group-hover/logo:opacity-60"
          style={{ background: "radial-gradient(circle, rgb(74 58 240 / 0.45), transparent 65%)" }}
        />
        <Image src="/logo-mark.png" alt="" width={98} height={136} priority className={`relative h-full w-full ${lift}`} />
        <span
          aria-hidden="true"
          className={`logo-sweep ${lift}`}
          style={{ WebkitMaskImage: "url(/logo-mark.png)", maskImage: "url(/logo-mark.png)" }}
        />
      </span>
      <span className="flex flex-col items-start" style={{ marginBottom: height * 0.02 }}>
        <span
          className={`relative block shrink-0 transition-[width,height] duration-500 ${animate ? "logo-word-in" : ""}`}
          style={{ width: wordW, height: wordH }}
        >
          <Image
            src={tone === "dark" ? "/logo-word.png" : "/logo-word-light.png"}
            alt="DRISYON"
            width={180}
            height={51}
            priority
            className="h-full w-full"
          />
        </span>
        {poweredBy && (
          <span
            className={`fade-in mt-[3px] whitespace-nowrap font-sans font-medium leading-none tracking-[0.04em] ${
              tone === "dark" ? "text-muted" : "text-white/55"
            }`}
            style={{ fontSize: Math.max(9.5, Math.round(height * 0.22)), animationDelay: "0.8s" }}
          >
            powered by <span className={tone === "dark" ? "text-text/80" : "text-white/80"}>Brain O Vision</span>
          </span>
        )}
      </span>
    </span>
  );
}
