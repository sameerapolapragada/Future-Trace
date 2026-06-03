#!/usr/bin/env bash
# Generate a no-op migration stub for a version already applied on remote Supabase.
# Usage: ./supabase/scripts/generate_migration_stub.sh 20260531120000_ai_scan_history_job_title

set -euo pipefail

VERSION="${1:?Usage: $0 <version> [optional_suffix]}"
SUFFIX="${2:-sync_stub}"

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
FILE="${ROOT}/supabase/migrations/${VERSION}_${SUFFIX}.sql"

if [[ -f "$FILE" ]]; then
  echo "File already exists: $FILE"
  exit 1
fi

cat >"$FILE" <<EOF
-- History sync: version ${VERSION} already applied on remote; stub keeps Git in sync.
select 1;
EOF

echo "Created $FILE"
