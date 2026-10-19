import { useState } from "react";
import { Reveal } from "@/components/alvan/reveal";
import { MockUI } from "@/components/alvan/mock-ui";
import { cn } from "@/lib/utils";
import { ResponsiveImage } from "./responsive-image";
import { Lightbox } from "./lightbox";

/**
 * Case-study gallery: first photo as a full-width row, the rest in a masonry
 * grid (CSS columns, so each photo keeps its own shape). Click opens the Lightbox.
 * Items without a real image (template placeholders) render as non-clickable mock-ups.
 *
 * items: [{ image?, alt, variant?, headline? }]
 */
function Tile({ item, onOpen, sizes, className }) {
  if (!item.image) {
    return (
      <div
        className={cn("overflow-hidden rounded-2xl border border-black/10", className)}
        style={{ aspectRatio: "4 / 3" }}
        role="img"
        aria-label={item.alt}
      >
        <MockUI variant={item.variant} headline={item.headline} className="h-full w-full" />
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open photo: ${item.alt}`}
      className={cn(
        "group block w-full overflow-hidden rounded-2xl border border-black/10 text-left",
        className,
      )}
    >
      <ResponsiveImage
        src={item.image}
        alt={item.alt}
        sizes={sizes}
        imgClassName="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
      />
    </button>
  );
}

function Gallery({ items, label }) {
  const [open, setOpen] = useState(null);
  const real = items.filter((i) => i.image);
  const lightboxItems = real.map((i) => ({ src: i.image, alt: i.alt, caption: i.alt, meta: label }));
  const openAt = (item) => setOpen(real.indexOf(item));

  const featured = items.length >= 3 ? items[0] : null;
  const rest = featured ? items.slice(1) : items;

  return (
    <>
      {featured && (
        <Reveal className="mt-12">
          <Tile item={featured} onOpen={() => openAt(featured)} sizes="(min-width: 1024px) 90vw, 100vw" />
        </Reveal>
      )}
      <div className={cn("gap-6 columns-1 sm:columns-2", featured ? "mt-6" : "mt-12", rest.length > 2 && "lg:columns-3")}>
        {rest.map((item, i) => (
          <Reveal key={item.alt} delay={(i % 3) * 90} className="mb-6 break-inside-avoid">
            <Tile item={item} onOpen={() => openAt(item)} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" />
          </Reveal>
        ))}
      </div>
      <Lightbox items={lightboxItems} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </>
  );
}

export { Gallery };
