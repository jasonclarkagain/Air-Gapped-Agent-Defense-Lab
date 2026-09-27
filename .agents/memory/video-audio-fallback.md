---
name: Video audio fallback
description: What to do when the optional generated music layer cannot be created for a video artifact.
---

Keep the video composition and export path fully usable without generated audio when the audio callback is unavailable. Do not block delivery of the visual explainer or add a fake audio asset.

**Why:** Audio generation may be unavailable in the current workspace mode, while the visual video can still preview and export cleanly.

**How to apply:** Treat music as optional unless the user explicitly requires sound; if unavailable, finish the visual build and state that the delivered video is silent.