#!/usr/bin/env python3
"""Convert the remaining unbounded list endpoints to paginated ones.

Most services shared the exact shape:

    async findAll(tenantId: string) {
      return this.prisma.<model>.findMany({ ...args });
    }

which returned the entire table in a single response. This rewrites them to
use the shared `paginatedQuery` helper.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SIGNATURE = re.compile(
    r"^(?P<indent>[ \t]*)async findAll\(tenantId: string\)\s*\{\n"
    r"(?P<body>(?:.*\n)*?)"
    r"(?P=indent)\}\n",
    flags=re.M,
)

FIND_MANY = re.compile(
    r"return this\.prisma\.(?P<model>\w+)\.findMany\((?P<args>\{.*?\})\);\n",
    flags=re.S,
)


def match_brace(text: str, start: int) -> int:
    """Returns the index just past the `}` that closes the object at `start`."""
    depth = 0
    i = start
    while i < len(text):
        c = text[i]
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                return i + 1
        i += 1
    raise ValueError('unbalanced braces')


def convert(path: Path) -> int:
    text = path.read_text()
    if 'findAll(tenantId: string)' not in text:
        return 0

    changed = 0
    while True:
        m = SIGNATURE.search(text)
        if not m:
            break
        body = m.group('body')
        fm = FIND_MANY.search(body)
        if not fm:
            # Not the shape we know how to convert; leave it and move on.
            break

        model = fm.group('model')
        args = fm.group('args')

        replacement = (
            f"{m.group('indent')}async findAll(tenantId: string, query: Record<string, any> = {{}}) {{\n"
            f"{m.group('indent')}  return paginatedQuery(\n"
            f"{m.group('indent')}    this.prisma.{model},\n"
            f"{m.group('indent')}    {args},\n"
            f"{m.group('indent')}    query,\n"
            f"{m.group('indent')}  );\n"
            f"{m.group('indent')}}}\n"
        )
        text = text[: m.start()] + replacement + text[m.end() :]
        changed += 1

        # Only convert the first occurrence per pass to keep the match fresh.
        break

    if changed:
        if 'paginatedQuery' not in text.split('\n')[0:20][0] and "from '../../common/utils/paginated-query.js'" not in text:
            depth = len(path.parent.parts) - len(Path('src').parts)
            rel = '../' * depth + 'common/utils/paginated-query.js'
            import_line = f"import {{ paginatedQuery }} from '{rel}';\n"
            imports = list(re.finditer(r"^import .*?;$", text, flags=re.M | re.S))
            if not imports:
                print(f"ABORT: no imports in {path}", file=sys.stderr)
                raise SystemExit(1)
            last = imports[-1]
            text = text[: last.end()] + "\n" + import_line.rstrip() + text[last.end() :]
        path.write_text(text)

    return changed


def main() -> int:
    total = 0
    for path in sorted(ROOT.glob('src/**/*.service.ts')):
        if 'generated' in path.parts:
            continue
        count = 0
        while True:
            n = convert(path)
            if n == 0:
                break
            count += n
        if count:
            print(f"  {count} endpoint(s)  {path.relative_to(ROOT)}")
            total += count
    print(f"paginated {total} endpoints")
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
