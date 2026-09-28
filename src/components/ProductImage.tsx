import { productImage } from "@/lib/images";

type Props = {
  slug: string;
  src?: string | null;
  alt: string;
  className?: string;
};

export function ProductImage({ slug, src, alt, className }: Props) {
  const url = productImage(slug, src);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={alt} className={className} />
  );
}
