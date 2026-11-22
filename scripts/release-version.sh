#!/usr/bin/env bash
set -euo pipefail

tag=${1:?Expected a stable release tag}
pattern='^v(0|[1-9][0-9]{0,3})\.(0|[1-9][0-9]{0,2})\.(0|[1-9][0-9]{0,2})$'
if [[ ! $tag =~ $pattern ]]; then
  echo "Expected a stable release tag such as v1.2.3" >&2
  exit 1
fi
code=$((BASH_REMATCH[1] * 1000000 + BASH_REMATCH[2] * 1000 + BASH_REMATCH[3]))
if ((code < 1 || code > 2100000000)); then
  echo "Version is outside the Android release version code range" >&2
  exit 1
fi
printf 'code=%s\nname=%s\n' "$code" "${tag#v}"
