#!/usr/bin/env bash
set -euo pipefail

project_root="$(CDPATH='' cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
tool_directory="$project_root/.specify/.venv"

if [[ "${1:-}" == 'bootstrap' ]]; then
    if [[ $# -ne 1 ]]; then
        echo 'Usage: scripts/specify.sh bootstrap' >&2
        exit 2
    fi
    python3 -m venv "$tool_directory"
    "$tool_directory/bin/python" -m pip install --requirement "$project_root/.specify/requirements.txt"
    exit 0
fi

if [[ ! -x "$tool_directory/bin/specify" ]]; then
    echo 'Spec Kit is not installed. Run: bash scripts/specify.sh bootstrap' >&2
    exit 1
fi

cd "$project_root"
exec "$tool_directory/bin/specify" "$@"
