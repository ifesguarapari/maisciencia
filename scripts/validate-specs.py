#!/usr/bin/env python3
"""Check specification structure and explicit traceability without changing files."""

# pylint: disable=invalid-name

import argparse
from collections import Counter
from dataclasses import dataclass, field
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit

REQUIRED_FILES = ("spec.md", "plan.md", "tasks.md", "verification.md")
FEATURE_NAME = re.compile(r"^\d{3}-[a-z0-9]+(?:-[a-z0-9]+)*$")
REQUIREMENT = re.compile(r"\bFR-\d{3,}\b")
REQUIREMENT_RANGE = re.compile(r"\bFR-(\d{3,})\s*[–—-]\s*FR-(\d{3,})\b")
TASK = re.compile(r"^\s*-\s+\[[ xX]\]\s+(T\d{3,})\b", re.MULTILINE)
STORY = re.compile(r"^#{1,6}\s+(?:\*\*)?(US\d+)\b", re.MULTILINE)
LINK = re.compile(r"(?<!!)\[[^\]\n]+\]\(([^)\n]+)\)")


@dataclass
class ValidationResult:
    """Structural findings; a clean result does not establish runtime behavior."""

    features: int = 0
    requirements: int = 0
    tasks: int = 0
    errors: list[str] = field(default_factory=list)


def definitions(document: str, prefix: str) -> list[str]:
    """Read requirement or success-criterion bullet definitions, not table mentions."""
    pattern = rf"^\s*-\s+(?:\*\*)?({prefix}-\d{{3,}})(?:\*\*)?\s*:"
    return re.findall(pattern, document, re.MULTILINE)


def requirement_references(document: str) -> set[str]:
    """Expand explicit ranges used in traceability notes and task descriptions."""
    references = set(REQUIREMENT.findall(document))
    for match in REQUIREMENT_RANGE.finditer(document):
        start, end = map(int, match.groups())
        if 0 <= end - start <= 1000:
            width = len(match.group(1))
            references.update(
                f"FR-{number:0{width}d}" for number in range(start, end + 1)
            )
    return references


def duplicate_errors(identifiers: list[str], location: str) -> list[str]:
    """Report a duplicate definition once for each affected identifier."""
    return [
        f"{location}: duplicate identifier {identifier}"
        for identifier, count in sorted(Counter(identifiers).items())
        if count > 1
    ]


def local_link_errors(path: Path, root: Path) -> list[str]:
    """Check local Markdown targets; external URLs and anchor names are not fetched."""
    errors = []
    document = re.sub(r"```.*?```", "", path.read_text(encoding="utf-8"), flags=re.S)
    for match in LINK.finditer(document):
        target = match.group(1).strip()
        if target.startswith("<") and ">" in target:
            target = target[1 : target.index(">")]
        else:
            target = target.split(' "', 1)[0].split(" '", 1)[0]
        parsed = urlsplit(target)
        if parsed.scheme or parsed.netloc or not parsed.path:
            continue
        resolved = path.parent / unquote(parsed.path)
        if not resolved.exists():
            errors.append(
                f"{path.relative_to(root)}: local link target does not exist: {target}"
            )
    return errors


def validate_identifiers(
    documents: dict[str, str], location: str, result: ValidationResult
) -> tuple[set[str], set[str]]:
    """Check definitions and collect identifiers scoped to the feature."""
    requirements = definitions(documents["spec.md"], "FR")
    criteria = definitions(documents["spec.md"], "SC")
    stories = STORY.findall(documents["spec.md"])
    tasks = TASK.findall(documents["tasks.md"])
    result.requirements += len(requirements)
    result.tasks += len(tasks)
    for identifiers, filename, label in (
        (requirements, "spec.md", "functional requirements (FR-###)"),
        (criteria, "spec.md", "success criteria (SC-###)"),
        (stories, "spec.md", "user stories (US# headings)"),
        (tasks, "tasks.md", "tasks (T### checkboxes)"),
    ):
        result.errors.extend(duplicate_errors(identifiers, f"{location}/{filename}"))
        if not identifiers:
            result.errors.append(f"{location}/{filename}: no {label} found")

    return set(requirements), set(stories)


def validate_traceability(
    documents: dict[str, str],
    location: str,
    identifiers: tuple[set[str], set[str]],
    result: ValidationResult,
) -> None:
    """Reject references to unknown requirements or stories and missing coverage."""
    known_requirements, stories = identifiers
    for filename in ("plan.md", "tasks.md", "verification.md"):
        references = requirement_references(documents[filename])
        for identifier in sorted(references - known_requirements):
            result.errors.append(
                f"{location}/{filename}: unknown requirement reference {identifier}"
            )
        if filename in ("tasks.md", "verification.md"):
            for identifier in sorted(known_requirements - references):
                result.errors.append(
                    f"{location}/{filename}: requirement {identifier} has no traceability"
                )

    for story in sorted(set(re.findall(r"\[(US\d+)\]", documents["tasks.md"]))):
        if story not in stories:
            result.errors.append(
                f"{location}/tasks.md: unknown story reference {story}"
            )


def validate_feature(feature: Path, root: Path, result: ValidationResult) -> None:
    """Check one feature using identifiers scoped to its own specification."""
    location = str(feature.relative_to(root))
    documents = {}
    for filename in REQUIRED_FILES:
        path = feature / filename
        if not path.is_file():
            result.errors.append(f"{location}: missing required artifact {filename}")
        else:
            documents[filename] = path.read_text(encoding="utf-8")
    if len(documents) != len(REQUIRED_FILES):
        return

    identifiers = validate_identifiers(documents, location, result)
    validate_traceability(documents, location, identifiers, result)
    for path in sorted(feature.rglob("*.md")):
        result.errors.extend(local_link_errors(path, root))


def validate_repository(root: Path) -> ValidationResult:
    """Collect findings from all numbered feature directories under specs/."""
    root = root.resolve()
    result = ValidationResult()
    features = sorted(
        path
        for path in (root / "specs").glob("*")
        if path.is_dir() and FEATURE_NAME.fullmatch(path.name)
    )
    if not features:
        result.errors.append("specs/: no numbered feature directories found")
    for feature in features:
        result.features += 1
        validate_feature(feature, root, result)
    return result


def main() -> int:
    """Print actionable findings and return a failing status for structural errors."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--root", type=Path, default=Path(__file__).resolve().parents[1]
    )
    arguments = parser.parse_args()
    result = validate_repository(arguments.root)
    for error in result.errors:
        print(f"ERROR: {error}", file=sys.stderr)
    summary = (
        f"{result.features} features, {result.requirements} requirements, "
        f"{result.tasks} tasks"
    )
    if result.errors:
        print(
            f"Specification validation failed: {len(result.errors)} errors; {summary}."
        )
        return 1
    print(f"Specification structure and traceability passed: {summary}.")
    print(
        "Runtime behavior, semantic completeness, and human approval are not checked."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
