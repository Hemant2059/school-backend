#!/usr/bin/env python3
"""Find DTO properties that carry no validation decorator.

The global validation pipe runs with `whitelist: true`, so any property
without a validation decorator is *stripped from the request body*. A
property that looks accepted but is silently dropped is worse than a
property that is rejected.

This is the check that caught the exam schedule's full-marks fields being
discarded without anyone noticing.

Two source layouts are handled:

    @IsString()              <- decorator on its own line
    @MinLength(1)
    password!: string;

    @IsOptional() @IsNumber() @Min(0)   <- decorators on the property line
    creditHours?: number;

and a decorator whose arguments span several lines.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Every class-validator / class-transformer decorator that makes a property
# survive the whitelist pipe.
VALIDATION = re.compile(
    r"@(Is[A-Z]\w*|Min\w*|Max\w*|Matches|Array\w*|Validate\w*|Length|Equals|Contains"
    r"|Allow|Type|Transform|IsNotEmpty)\b"
)

PROPERTY = re.compile(r"^([A-Za-z_][A-Za-z0-9_]*)\s*[!?]?\s*:")


def paren_delta(text: str) -> int:
    """The net parenthesis balance, ignoring parentheses inside strings."""
    delta = 0
    index = 0
    length = len(text)
    while index < length:
        char = text[index]
        if char in "'\"":
            quote = char
            index += 1
            while index < length:
                if text[index] == "\\":
                    index += 2
                    continue
                if text[index] == quote:
                    break
                index += 1
        elif char == "(":
            delta += 1
        elif char == ")":
            delta -= 1
        index += 1
    return delta


def scan(text: str) -> list[tuple[str, int, bool]]:
    lines = text.split("\n")
    results: list[tuple[str, int, bool]] = []

    pending = ""          # decorator text that applies to the next property
    pending_depth = 0     # unclosed parentheses inside `pending`
    in_interface = False

    for index, line in enumerate(lines):
        stripped = line.strip()

        if re.match(r"^(export\s+)?interface\s", stripped):
            in_interface = True
        elif re.match(r"^(export\s+)?(abstract\s+)?(class|export class)\s", stripped):
            in_interface = False

        if pending_depth > 0:
            # Still inside a multi-line decorator's arguments.
            pending += "\n" + line
            pending_depth += paren_delta(line)
            if pending_depth <= 0:
                pending_depth = 0
            continue

        # Split the decorators off the front of the line.
        decorator_text = ""
        remainder = line
        while True:
            match = re.match(r"^\s*@", remainder)
            if not match:
                break
            consumed = 0
            index_in_line = match.end()
            while index_in_line < len(remainder) and (
                remainder[index_in_line].isalnum() or remainder[index_in_line] in "_."
            ):
                index_in_line += 1
            consumed = index_in_line
            probe = index_in_line
            while probe < len(remainder) and remainder[probe] in " \t":
                probe += 1
            if probe < len(remainder) and remainder[probe] == "(":
                depth = paren_delta(remainder[probe:])
                if depth > 0:
                    # The arguments continue on the following lines.
                    decorator_text += remainder[:]
                    pending = decorator_text
                    pending_depth = depth
                    remainder = ""
                    break
                consumed = probe + remainder[probe:].index(")", 0) + 1
            decorator_text += remainder[:consumed]
            remainder = remainder[consumed:]

        property_match = PROPERTY.match(remainder.strip())

        if property_match and not in_interface:
            own = VALIDATION.search(decorator_text)
            inherited = VALIDATION.search(pending)
            has_validation = bool(own or inherited)
            results.append((property_match.group(1), index + 1, has_validation))
            pending = ""
            pending_depth = 0
            continue

        if decorator_text and not property_match and pending_depth <= 0:
            # A decorator on its own line applies to the next property.
            pending = decorator_text

        if not stripped:
            pending = ""
            pending_depth = 0

    return results


def main() -> int:
    findings: list[tuple[str, int, str]] = []

    for path in sorted(ROOT.glob("src/**/*.dto.ts")):
        if "generated" in path.parts:
            continue
        text = path.read_text()
        for name, line_no, has_validation in scan(text):
            if not has_validation:
                findings.append((str(path.relative_to(ROOT)), line_no, name))

    if not findings:
        print("Every DTO property carries a validation decorator.")
        return 0

    print(
        f"{len(findings)} DTO properties have no validation decorator and are "
        "therefore stripped from the request body by the whitelist pipe:"
    )
    print()
    for path, line, name in findings:
        print(f"  {path}:{line}  {name}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
