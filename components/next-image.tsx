import Image, { ImageProps } from "next/image";
import { useState } from "react";

type NextImageProps = ImageProps & {
  fallbackSrc?: string;
};

export function NextImage({
  src,
  alt,
  fallbackSrc = "/placeholder.jpg",
  ...props
}: NextImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
} 