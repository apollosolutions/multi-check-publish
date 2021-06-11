#!/usr/bin/env bash -ex

testdir=$(dirname $0)

node $testdir/missions.js &
yarn wait-on tcp:4001
server_pid=$(lsof -i tcp:4001 | grep node | awk '{print $2}')

function cleanup()
{
  kill $server_pid
}

trap cleanup EXIT
trap cleanup ERR

node index.js supergraph publish lenny-roverx-test@current --config test/config.yaml --log info
success=$?

kill $server_pid

if [[ $success == 0 ]]; then
  exit 0
fi

exit 1
