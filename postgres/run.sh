#!/bin/bash -xe

main() {
  check_params "$@"

  if [[ "local" = "$1" ]]; then
    if [ ! "$(docker ps -q -f name=zro_postgres_poc_local)" ]; then
      docker run -d --name zro_postgres_poc_local -p 15432:5432 --restart=always -e POSTGRES_PASSWORD=password lucaswiix/zrobank_postgres_local -c fsync=off -c full_page_writes=off -c synchronous_commit=OFF
    else
      echo "Local Postgres container already running"
    fi
  else
    if [ ! "$(docker ps -q -f name=zro_postgres_poc_test)" ]; then
      docker run -d --name zro_postgres_poc_test -p 25432:5432 --restart=always -e POSTGRES_PASSWORD=password lucaswiix/zrobank_postgres_local -c fsync=off -c full_page_writes=off -c synchronous_commit=OFF
    else
      echo "Test Postgres container already running"
    fi
  fi
}

check_params() {
  if [[ -z "$1" ]]; then
    echo "Missing env argument: should be local or test"
    exit 1
  fi

  if [ "local" != "$1" ] && [ "test" != "$1" ]; then
    echo "Invalid env argument"
    exit 1
  fi

}

main "$@"
