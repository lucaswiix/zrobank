# ZroBank

- Setup prod

```bash
docker-compose up -d
```

- Api Documentation

```
http://localhost:3000/api-docs
```

- Alias to development
  yarn test // run all tests
  yarn test:spec // run all unit tests
  yarn test:migrations // run migrations on test env

- Alias to create test and local DB

```bash
./postgres/run.sh local
./postgres/run.sh test
```
