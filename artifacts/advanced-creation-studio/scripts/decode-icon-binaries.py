#!/usr/bin/env python3
"""Decode icon-binaries.b64.json into public/ PNG and ICO assets."""

from __future__ import annotations

import base64
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "public"
BUNDLE = ROOT / "icon-binaries.b64.json"


def main() -> None:
    data = json.loads(BUNDLE.read_text())
    for name, b64 in data.items():
        path = ROOT / name
        path.write_bytes(base64.b64decode(b64))
        print(f"wrote {path.name} ({path.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
