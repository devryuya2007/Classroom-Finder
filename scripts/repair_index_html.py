#!/usr/bin/env python3
import re
import sys
import html
from pathlib import Path


def fix_file(path: Path) -> None:
    content = path.read_text(encoding="utf-8", errors="ignore")

    # 1) Fix obvious typos: </scrip> -> </script>
    content = content.replace("</scrip>", "</script>")

    # 2) Normalize cases where </script> is split across lines like </script\n   ><script
    # Make sure we have `</script>` then immediately the next tag (keep the next tag intact).
    # Replace any whitespace between `</script` and `>` and trim whitespace after it.
    content = re.sub(r"</script\s*>\s*<", "</script><", content, flags=re.IGNORECASE)

    # 3) Unescape HTML entities inside inline <script> blocks (skip external src scripts).
    #    This fixes cases where JS operators and tokens were HTML-escaped (e.g., &amp;&amp;, &lt;, &gt;).
    def unescape_in_script(match: re.Match) -> str:
        open_tag = match.group(1)
        inner = match.group(2)
        close_tag = match.group(3)

        # If the script has a src attribute, skip (no inline JS to unescape)
        if re.search(r"\ssrc\s*=", open_tag, flags=re.IGNORECASE):
            return open_tag + inner + close_tag

        # If the script is JSON/LD, skip unescaping to avoid breaking JSON
        if re.search(r"\stype\s*=\s*\"application/(?:json|ld\+json)\"", open_tag, flags=re.IGNORECASE):
            return open_tag + inner + close_tag

        # Perform HTML entity unescape on the inner JS
        new_inner = html.unescape(inner)
        return open_tag + new_inner + close_tag

    script_re = re.compile(r"(?is)(<script\b[^>]*>)(.*?)(</script>)")
    content = script_re.sub(unescape_in_script, content)

    # 4) Write back
    path.write_text(content, encoding="utf-8")


def main():
    if len(sys.argv) != 2:
        print("Usage: repair_index_html.py <path-to-index.html>")
        sys.exit(2)
    path = Path(sys.argv[1])
    if not path.exists():
        print(f"File not found: {path}")
        sys.exit(1)
    fix_file(path)


if __name__ == "__main__":
    main()

