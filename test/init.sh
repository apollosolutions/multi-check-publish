#!/usr/bin/env bash -ex

testdir=$(dirname $0)

actual=$(node index.js supergraph init lenny-roverx-test@current)
success=$?

expected=$(cat $testdir/init-expected.yaml)

if [[ $success != 0 ]]; then
  exit 1
fi

if [[ "$actual" != "$expected" ]]; then
  echo "=== EXPECTED ==="
  echo $expected
  echo ""
  echo "=== ACTUAL ==="
  echo $actual
  echo ""
  exit 1
fi

exit 0
