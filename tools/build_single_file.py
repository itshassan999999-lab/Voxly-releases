"""Builds docs/voxly-single-file.html: the landing page with CSS, JS and fonts
inlined, for pasting into a page builder such as GoHighLevel (Custom HTML).
Images and the legal pages point at the hosted site. Run: python3 tools/build_single_file.py
"""
import base64, pathlib, re

DOCS = pathlib.Path(__file__).resolve().parent.parent / "docs"
BASE = "https://voxly.snthropic.com/"

html = (DOCS / "index.html").read_text()
css = (DOCS / "assets/site.css").read_text() + "\n" + (DOCS / "assets/video.css").read_text()
js = (DOCS / "assets/site.js").read_text()
vjs = (DOCS / "assets/video.js").read_text()

for font in ("inter-var", "jakarta-var"):
    data = base64.b64encode((DOCS / f"assets/fonts/{font}.woff2").read_bytes()).decode()
    css = css.replace(f'url("fonts/{font}.woff2")', f'url("data:font/woff2;base64,{data}")')

html = re.sub(r'\s*<link rel="preload"[^>]*>', "", html)
html = html.replace('<link rel="stylesheet" href="assets/video.css">', "")
html = html.replace('<link rel="stylesheet" href="assets/site.css">', f"<style>\n{css}\n</style>")
html = html.replace('<script src="assets/video.js" defer></script>', f"<script>\n{vjs}\n</script>")
html = html.replace('<script src="assets/site.js" defer></script>', f"<script>\n{js}\n</script>")
html = re.sub(r'(src|href|data-logo|data-audio)="(assets/[^"]+|privacy\.html|terms\.html)"', lambda m: f'{m[1]}="{BASE}{m[2]}"', html)

out = DOCS / "voxly-single-file.html"
out.write_text(html)
print(out, len(html) // 1024, "KB")
