#!/bin/bash

PLATFORM='unknown'
UNAMESTR=`uname`
if [[ "$UNAMESTR" == 'Linux' ]]; then
   PLATFORM='linux'
elif [[ "$UNAMESTR" == 'FreeBSD' ]]; then
   PLATFORM='freebsd'
fi


if [[ $PLATFORM == 'linux' ]]; then
   bash -c './bin/sql-migrate/sql-migrate-linux-amd64 "$@"' ./bin/sql-migrate/sql-migrate-linux-amd64 $@
else
   bash -c './bin/sql-migrate/sql-migrate-darwin-amd64 "$@"' ./bin/sql-migrate/sql-migrate-darwin-amd64 $@
fi
