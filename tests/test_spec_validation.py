"""Exercise structural failures that could hide broken specification traceability."""

import importlib.util
from pathlib import Path
import sys
import tempfile
import unittest

SCRIPT_PATH = Path(__file__).resolve().parents[1] / "scripts" / "validate-specs.py"
MODULE_SPEC = importlib.util.spec_from_file_location("spec_validation", SCRIPT_PATH)
VALIDATOR = importlib.util.module_from_spec(MODULE_SPEC)
sys.modules[MODULE_SPEC.name] = VALIDATOR
MODULE_SPEC.loader.exec_module(VALIDATOR)


class SpecValidationTests(unittest.TestCase):
    """Each fixture is isolated from the repository and contains no runtime code."""

    def setUp(self):
        # The unittest context closes this resource even when a test fails.
        # pylint: disable-next=consider-using-with
        self.root = Path(self.enterContext(tempfile.TemporaryDirectory()))
        self.feature = self.root / "specs" / "001-example"
        self.feature.mkdir(parents=True)
        self.write(
            "spec.md",
            "# Example\n### US1 — Example\n"
            "- **FR-001**: First requirement.\n"
            "- **FR-002**: Second requirement.\n"
            "- **FR-003**: Third requirement.\n"
            "- **SC-001**: Observable outcome.\n",
        )
        self.write("plan.md", "# Plan\nFR-001–FR-003\n")
        self.write("tasks.md", "# Tasks\n- [x] T001 [US1] Cover FR-001–FR-003.\n")
        self.write("verification.md", "# Verification\nFR-001, FR-002, FR-003\n")

    def write(self, name, text):
        """Replace a single fixture artifact."""
        (self.feature / name).write_text(text, encoding="utf-8")

    def errors(self):
        """Return the findings produced for this fixture."""
        return VALIDATOR.validate_repository(self.root).errors

    def test_valid_traceability_accepts_ranges_and_local_links(self):
        """Valid explicit ranges and an existing relative link preserve coverage."""
        self.write("research.md", "See [the spec](spec.md#example).\n")
        self.assertEqual(self.errors(), [])

    def test_unknown_requirement_reference_is_rejected(self):
        """A mistyped requirement in a plan fails before implementation."""
        self.write("plan.md", "FR-999\n")
        self.assertTrue(
            any("unknown requirement reference FR-999" in e for e in self.errors())
        )

    def test_missing_artifact_is_rejected(self):
        """A missing verification record cannot pass on the other artifacts alone."""
        (self.feature / "verification.md").unlink()
        self.assertTrue(
            any("missing required artifact verification.md" in e for e in self.errors())
        )

    def test_duplicate_requirement_definition_is_rejected(self):
        """Two definitions of one requirement are ambiguous and must fail."""
        with (self.feature / "spec.md").open("a", encoding="utf-8") as stream:
            stream.write("- **FR-001**: Conflicting definition.\n")
        self.assertTrue(any("duplicate identifier FR-001" in e for e in self.errors()))

    def test_missing_task_coverage_is_rejected(self):
        """A requirement omitted from work cannot masquerade as complete coverage."""
        self.write("tasks.md", "- [ ] T001 [US1] Cover FR-001 and FR-003.\n")
        self.assertTrue(
            any("requirement FR-002 has no traceability" in e for e in self.errors())
        )

    def test_unknown_story_reference_is_rejected(self):
        """A task must refer to an actual story in its own feature."""
        self.write("tasks.md", "- [ ] T001 [US9] Cover FR-001–FR-003.\n")
        self.assertTrue(any("unknown story reference US9" in e for e in self.errors()))

    def test_broken_local_link_is_rejected(self):
        """A missing linked contract is visible as a structural error."""
        self.write("research.md", "See [contract](contracts/missing.yaml).\n")
        self.assertTrue(
            any("local link target does not exist" in e for e in self.errors())
        )

    def test_duplicate_task_and_story_are_rejected(self):
        """Reused story or task IDs make traceability ambiguous."""
        with (self.feature / "spec.md").open("a", encoding="utf-8") as stream:
            stream.write("### US1 — Repeated story\n")
        self.write(
            "tasks.md",
            "- [ ] T001 [US1] Cover FR-001–FR-003.\n- [x] T001 [US1] Repeated task.\n",
        )
        errors = self.errors()
        self.assertTrue(any("duplicate identifier US1" in e for e in errors))
        self.assertTrue(any("duplicate identifier T001" in e for e in errors))

    def test_external_links_and_code_examples_are_not_checked(self):
        """Network access and example code are outside local link validation."""
        self.write(
            "research.md",
            "[Source](https://example.invalid/spec)\n"
            "[Section](#section)\n```markdown\n[Example](missing.md)\n```\n",
        )
        self.assertEqual(self.errors(), [])


if __name__ == "__main__":
    unittest.main()
