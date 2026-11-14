#!/usr/bin/env python3
"""Remove the imports that oxlint reports as unused.

Keeping the import lists honest means the linter output stays at zero, so a
real warning is never lost in the noise.
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

UNUSED_IMPORT = re.compile(
    r"^(?P<file>[^:]+):(?P<line>\d+):\d+: warning eslint\(no-unused-vars\): "
    r"Identifier '(?P<name>[A-Za-z_][A-Za-z0-9_]*)' is imported but never used\."
, re.M)

UNUSED_VARIABLE = re.compile(
    r"^(?P<file>[^:]+):(?P<line>\d+):\d+: warning eslint\(no-unused-vars\): "
    r"Variable '(?P<name>[A-Za-z_][A-Za-z0-9_]*)' is declared but never used\."
, re.M)

UNUSED_PARAMETER = re.compile(
    r"^(?P<file>[^:]+):(?P<line>\d+):\d+: warning eslint\(no-unused-vars\): "
    r"Parameter '(?P<name>[A-Za-z_][A-Za-z0-9_]*)' is declared but never used\."
, re.M)


def lint() -> str:
    return subprocess.run(
        ["npx", "oxlint", "--type-aware", "src/", "test/"],
        cwd=ROOT,
        capture_output=True,
        text=True,
    ).stdout


def remove_identifier(source: str, name: str) -> str:
    """Removes `name` from the first import list that contains it."""
    pattern = re.compile(r"import \{([^}]*)\} from '([^']+)';", re.S)

    def repl(match: "re.Match[str]") -> str:
        parts = [p.strip() for p in match.group(1).split(",") if p.strip()]
        if name not in parts:
            return match.group(0)
        parts = [p for p in parts if p != name]
        if not parts:
            return ""
        return f"import {{ {', '.join(parts)} }} from '{match.group(2)}';"

    # Every import statement is examined; `repl` leaves the ones that do
    # not mention the identifier untouched.
    return pattern.sub(repl, source)


def main() -> int:
    changed = 0

    for _ in range(5):
        output = lint()
        targets = []
        for pattern in (UNUSED_IMPORT, UNUSED_VARIABLE, UNUSED_PARAMETER):
            for match in pattern.finditer(output):
                targets.append((match.group("file"), match.group("name"), pattern is UNUSED_IMPORT))

        if not targets:
            break

        progressed = False
        for rel, name, is_import in targets:
            path = ROOT / rel
            if not path.exists():
                continue
            source = path.read_text()
            if is_import:
                updated = remove_identifier(source, name)
            else:
                # Rename the unused binding so the intent is explicit.
                updated = re.sub(
                    rf"\b{re.escape(name)}\b", f"_{name}", source, count=1
                )
            if updated != source:
                path.write_text(updated)
                changed += 1
                progressed = True
        if not progressed:
            break

    print(f"cleaned {changed} unused import(s)/binding(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
