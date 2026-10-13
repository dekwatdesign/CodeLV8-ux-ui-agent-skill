"""Check deployable skill links, metadata and portability (not UX quality)."""
from pathlib import Path
import re
import sys
import yaml

root = Path(__file__).resolve().parents[1] / "skills" / "codelv8-ui-ux"
errors = []
links = 0
for path in root.rglob("*.md"):
    content = path.read_text(encoding="utf-8")
    for target in re.findall(r"\]\(([^)]+)\)", content):
        if re.match(r"https?://", target):
            continue
        resolved = (path.parent / target.split("#", 1)[0]).resolve()
        if not resolved.is_relative_to(root.resolve()) or not resolved.is_file():
            errors.append(f"Broken or escaping reference: {path.name}: {target}")
        links += 1
    if re.search(r"(?<![\w])[A-Za-z]:[/\\](?!/)|/(?:Users|home)/|skill-support/", content):
        errors.append(f"Machine-specific dependency: {path.name}")
    if re.search(r"\b(?:TODO|FIXME|TBD)\b|\[INSERT", content):
        errors.append(f"Unfinished placeholder: {path.name}")

entry = (root / "SKILL.md").read_text(encoding="utf-8")
frontmatter = yaml.safe_load(entry.split("---", 2)[1])
metadata = yaml.safe_load((root / "agents" / "openai.yaml").read_text(encoding="utf-8"))
if frontmatter["name"] != root.name or frontmatter["metadata"]["version"] != "1.0.0":
    errors.append("Skill identity/version mismatch")
interface = metadata.get("interface", {})
if not 25 <= len(interface.get("short_description", "")) <= 64:
    errors.append("UI description must be 25-64 characters")
if "$" + root.name not in interface.get("default_prompt", ""):
    errors.append("Default prompt must invoke the installed skill name")
if metadata.get("policy", {}).get("allow_implicit_invocation") is not True:
    errors.append("Automatic discovery must be enabled")
if metadata.get("dependencies"):
    errors.append("Standalone package should not require external tool dependencies")
if errors:
    print("\n".join(errors))
    sys.exit(1)
print(f"Package checks passed: {links} local links, metadata, identity, placeholders, portability")
