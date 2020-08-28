# ZroBank

## Start

```bash
docker-compose up -d
```

## Api Documentation

```
http://localhost:3000/api-docs
```

## Alias to development

- Run all tests

```
  yarn test
```

- Run only unit tests

```
  yarn test:spec
```

- Run migrations on test env

```
  yarn test:migrations
```

## Alias to create test and local DB

```bash
./postgres/run.sh local
./postgres/run.sh test
```

tecnologies used

- express
- typescript
- sequelize
- migrations
- function pattern
- DDD
- single element pattern
- husky pre-push

## structure folder

I chose to use single element pattern for this project due to the simplicity of maintenance.
