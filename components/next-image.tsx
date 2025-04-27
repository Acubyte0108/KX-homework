import { cn } from "@/lib/utils";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

type NextImageProps = ImageProps & {
  fallbackSrc?: string;
};

export function NextImage({
  src,
  alt,
  className,
  fallbackSrc = "/placeholder.jpg",
  ...props
}: NextImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      className={cn("object-cover w-full h-full", className)}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
} 