#!/usr/bin/env bash

# After adding a new third-party dependency, developers should run this script.
set -o errexit -o nounset -o pipefail

bazelisk run //requirements:runtime.update
bazelisk run //requirements:requirements.all.update
bazelisk run //:gazelle_python_manifest.update
