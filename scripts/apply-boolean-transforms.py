#!/usr/bin/env python3
"""Add the raw-value boolean parser to every `@IsBoolean()` DTO field.

class-transformer's implicit conversion turns the string "false" into `true`,
which inverted every boolean query parameter in the API. `@Transform` runs
*after* implicit conversion, so `BooleanParam()` reads the untouched raw value
from the source object instead.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Matches an @IsBoolean() occurrence and captures the decorated member
# (which may span two lines when the decorator is on its own line).
FIELD_RE = re.compile(
    r"^(?P<indent>[ \t]*)@IsBoolean\(\)(?P<between>[^\n]*)\n(?P<decl>[ \t]*(?:readonly )?[A-Za-z_][A-Za-z0-9_]*\??\s*:)",
    flags=re.M,
)


def relative_import(path: Path) -> str:
    depth = len(path.parent.parts) - len(Path("src").parts)
    return "../" * depth + "common/decorators/boolean-param.decorator.js"


def main() -> int:
    dto_files = sorted(ROOT.glob("src/**/*.dto.ts"))
    total = 0
    touched = 0
    for path in dto_files:
        if "generated" in path.parts:
            continue
        text = path.read_text()
        if "@IsBoolean()" not in text:
            continue

        lines = text.split("\n")
        out: list[str] = []
        i = 0
        changed = False
        while i < len(lines):
            line = lines[i]
            if "@IsBoolean()" in line:
                indent = line[: len(line) - len(line.lstrip())]
                # The member declaration is on this line, or the next one when
                # the decorator sits on its own line.
                if re.search(r"@IsBoolean\(\)\s*\S", line) and "?" in line.split("@IsBoolean()", 1)[1]:
                    member = line
                    i += 1
                elif i + 1 < len(lines):
                    member = lines[i + 1]
                    i += 2
                else:
                    out.append(line)
                    i += 1
                    continue

                if "@BooleanParam()" not in line and "@BooleanParam()" not in member:
                    out.append(f"{indent}@BooleanParam()")
                    changed = True
                    total += 1
                out.append(line)
                if member is not line:
                    out.append(member)
                continue
            out.append(line)
            i += 1

        if changed:
            new_text = "\n".join(out)
            imp = relative_import(path.relative_to(ROOT))
            import_line = f"import {{ BooleanParam }} from '{imp}';\n"
            if import_line not in new_text:
                imports = list(re.finditer(r"^import .*?;$", new_text, flags=re.M | re.S))
                if not imports:
                    print(f"ABORT: no imports in {path}", file=sys.stderr)
                    return 1
                last = imports[-1]
                new_text = new_text[: last.end()] + "\n" + import_line.rstrip() + new_text[last.end() :]
            path.write_text(new_text)
            touched += 1

    print(f"added BooleanParam() to {total} fields across {touched} DTO files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
