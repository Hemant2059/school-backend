#!/usr/bin/env python3
"""Annotate controllers with the platform/tenant domain marker.

The platform and tenant RBAC tables share permission code strings
(`roles.manage`, `permissions.manage`, ...). A school tenant holding
`roles.manage` could therefore reach `/platform/roles` and rewrite the
platform RBAC catalogue. `@PlatformOnly()` marks the routes that only SaaS
company staff may reach.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# (relative path, decorator kind)
PLATFORM_ONLY = [
    "src/auth/auth.controller.ts",
    "src/platform/controllers/platform-permissions.controller.ts",
    "src/platform/controllers/platform-roles.controller.ts",
    "src/platform/controllers/platform-users.controller.ts",
    "src/organizations/controllers/organization.controller.ts",
    "src/tenants/controllers/tenant.controller.ts",
    "src/tenants/controllers/platform-tenant-users.controller.ts",
    "src/subscriptions/controllers/feature.controller.ts",
    "src/subscriptions/controllers/plan.controller.ts",
    "src/subscriptions/controllers/plan-feature.controller.ts",
]

# Files that need the import path resolved relative to their own directory.
IMPORT_FOR = {
    "src/auth/auth.controller.ts": "./decorators/platform-only.decorator.js",
}
DEFAULT_IMPORT = "../../auth/decorators/platform-only.decorator.js"


def import_path(rel: str) -> str:
    if rel in IMPORT_FOR:
        return IMPORT_FOR[rel]
    depth = len(Path(rel).parent.parts) - len(Path("src").parts)
    return "../" * depth + "auth/decorators/platform-only.decorator.js"


def apply_class_marker(rel: str) -> bool:
    path = ROOT / rel
    text = path.read_text()
    if "@PlatformOnly()" in text:
        return False

    controller_match = re.search(r"^@Controller\(", text, flags=re.M)
    if not controller_match:
        print(f"ABORT: no @Controller in {rel}", file=sys.stderr)
        raise SystemExit(1)

    decorator = "@PlatformOnly()\n"
    text = text[: controller_match.start()] + decorator + text[controller_match.start() :]

    imp = import_path(rel)
    import_line = f"import {{ PlatformOnly }} from '{imp}';\n"
    if import_line not in text:
        # Insert after the last top-level import statement.
        imports = list(re.finditer(r"^import .*?;$", text, flags=re.M | re.S))
        if not imports:
            print(f"ABORT: no imports in {rel}", file=sys.stderr)
            raise SystemExit(1)
        last = imports[-1]
        text = text[: last.end()] + "\n" + import_line.rstrip() + text[last.end() :]

    path.write_text(text)
    return True


def main() -> int:
    changed = 0
    for rel in PLATFORM_ONLY:
        if apply_class_marker(rel):
            changed += 1
            print(f"  + @PlatformOnly()  {rel}")
        else:
            print(f"  = already marked   {rel}")
    print(f"{changed}/{len(PLATFORM_ONLY)} controllers annotated")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
