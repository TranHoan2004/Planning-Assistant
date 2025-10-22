#!/usr/bin/env bash
set -euo pipefail

# Usage function
usage() {
	echo "Usage: $0 <.env-file> <bazel-target> [bazel args...]"
	echo "Example: $0 .env.development //my:target -- --flag"
	exit 1
}

# Require at least 3 arguments
if [ $# -lt 3 ]; then
	usage
fi

ENV_FILE=$1
shift # remove env file from args

if [ ! -f "$ENV_FILE" ]; then
	echo "Env file '$ENV_FILE' not found!"
	exit 1
fi

SUBCOMMAND=$1 # run or test
TARGET=$2     # bazel target
shift 2       # remove subcommand + target
EXTRA_ARGS=("$@")

# Read env file -> filter out comments/empty lines
ENV_VARS=$(grep -v '^\s*#' "$ENV_FILE" | grep -v '^\s*$' | xargs)

if [ -z "$ENV_VARS" ]; then
	echo "No environment variables found in $ENV_FILE"
	exit 1
fi

eval "$ENV_VARS bazelisk $SUBCOMMAND $TARGET ${EXTRA_ARGS[*]}"
