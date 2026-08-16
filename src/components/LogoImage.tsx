import { useState } from "react";
import { cn } from "@/lib/utils";

type LogoImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  wrapperClassName?: string;
};

/**
 * LogoImage renders an <img> with a skeleton placeholder that occupies the
 * exact same space, preventing layout shift while the asset loads.
 * Pass sizing classes (h-9 w-auto, h-16 w-16, etc.) via `className` — they
 * are applied to both the skeleton and the image.
 */
export function LogoImage({
  className,
  wrapperClassName,
  onLoad,
  onError,
  alt,
  ...props
}: LogoImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <span className={cn("relative inline-block align-middle", wrapperClassName)}>
      {!loaded && (
        <span
          aria-hidden="true"
          className={cn(
            "block animate-pulse rounded-md bg-muted/60",
            className,
          )}
        />
      )}
      <img
        {...props}
        alt={alt}
        decoding="async"
        loading={props.loading ?? "lazy"}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          setLoaded(true);
          onError?.(e);
        }}
        className={cn(
          className,
          "transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0 absolute inset-0",
        )}
      />
    </span>
  );
}

export default LogoImage;