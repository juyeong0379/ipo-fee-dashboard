"""Check the homepage JavaScript syntax and mandatory static data files."""
from html.parser import HTMLParser
from pathlib import Path
import subprocess
import tempfile
import json

root = Path(__file__).resolve().parents[1] / "docs"
index = (root / "index.html").read_text(encoding="utf-8")

class Scripts(HTMLParser):
    def __init__(self):
        super().__init__()
        self.inside = False
        self.parts = []
    def handle_starttag(self, tag, attrs):
        if tag == "script":
            self.inside = True
    def handle_endtag(self, tag):
        if tag == "script":
            self.inside = False
    def handle_data(self, data):
        if self.inside:
            self.parts.append(data)

p = Scripts()
p.feed(index)
if not p.parts:
    raise SystemExit("Homepage has no JavaScript")
with tempfile.TemporaryDirectory() as tmp:
    script = Path(tmp) / "homepage.js"
    script.write_text("\n".join(p.parts), encoding="utf-8")
    subprocess.run(["node", "--check", str(script)], check=True)
for path in ("data.json", "review.json"):
    data = json.loads((root / path).read_text(encoding="utf-8"))
    assert isinstance(data.get("records"), list), path
assert (root / "ipo_master.csv").is_file()
print("PASS: homepage JavaScript and dataset files")
