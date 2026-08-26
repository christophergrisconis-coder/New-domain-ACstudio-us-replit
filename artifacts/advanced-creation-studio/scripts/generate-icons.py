#!/usr/bin/env python3
"""Generate ACS PWA + favicon assets from SVG masters (full-bleed, no white corners)."""

from __future__ import annotations

import io
from pathlib import Path

import cairosvg
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public"
MASTER = ROOT / "acs-icon-master.svg"
MASKABLE = ROOT / "acs-icon-maskable.svg"
TAB = ROOT / "favicon.svg"
BG = (0x20, 0x1A, 0x2A, 255)


def svg_to_png(svg_path: Path, size: int) -> Image.Image:
    raw = cairosvg.svg2png(
        url=str(svg_path),
        output_width=size,
        output_height=size,
        background_color="#201A2A",
    )
    im = Image.open(io.BytesIO(raw)).convert("RGBA")
    bg = Image.new("RGBA", im.size, BG)
    return Image.alpha_composite(bg, im)


def save_rgb_png(im: Image.Image, path: Path) -> None:
    out = Image.new("RGB", im.size, BG[:3])
    out.paste(im.convert("RGB"))
    out.save(path, format="PNG", optimize=True)
    print(f"wrote {path.name} {out.size} RGB TL={out.getpixel((0, 0))}")


def save_rgba_png(im: Image.Image, path: Path) -> None:
    im.save(path, format="PNG", optimize=True)
    print(f"wrote {path.name} {im.size} RGBA TL={im.getpixel((0, 0))}")


def write_ico(path: Path, images: list[Image.Image]) -> None:
    # Ensure all are RGBA for ICO embedding
    rgba = [im.convert("RGBA") for im in images]
    # Pillow ICO: pass largest first; sizes= controls embedded sizes
    rgba_sorted = sorted(rgba, key=lambda i: i.width, reverse=True)
    rgba_sorted[0].save(
        path,
        format="ICO",
        sizes=[(im.width, im.height) for im in rgba_sorted],
        append_images=rgba_sorted[1:],
    )
    print(f"wrote {path.name} {[im.size for im in rgba_sorted]}")


def main() -> None:
    fav16 = svg_to_png(TAB, 16)
    fav32 = svg_to_png(TAB, 32)
    save_rgba_png(fav16, ROOT / "favicon-16x16.png")
    save_rgba_png(fav32, ROOT / "favicon-32x32.png")
    write_ico(ROOT / "favicon.ico", [fav16, fav32])

    save_rgb_png(svg_to_png(MASTER, 180), ROOT / "apple-touch-icon.png")
    save_rgb_png(svg_to_png(MASTER, 192), ROOT / "android-chrome-192x192.png")
    save_rgb_png(svg_to_png(MASTER, 512), ROOT / "android-chrome-512x512.png")
    save_rgb_png(svg_to_png(MASKABLE, 192), ROOT / "android-chrome-192x192-maskable.png")
    save_rgb_png(svg_to_png(MASKABLE, 512), ROOT / "android-chrome-512x512-maskable.png")

    check = Image.open(ROOT / "android-chrome-512x512.png").convert("RGB")
    corner = check.getpixel((0, 0))
    assert corner[0] < 80 and abs(corner[0] - 0x20) < 8, f"bad corner {corner}"
    print("corner check OK", corner)


if __name__ == "__main__":
    main()
