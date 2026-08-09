#!/usr/bin/env bash
set -euo pipefail

# Local build script / UI preparation script for release.

root_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

# Build Frontend
npm --prefix="$root_dir/ui" install
npm --prefix="$root_dir/ui" run build

# Build Backend
cd "$root_dir"
go get
go build
