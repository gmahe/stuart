## PREREQUISITES

Node.js or Docker-compose are necessary.

You need to add MONGO_URI_STUART environment variable to connect to the remote mongo database.

```bash
> export MONGO_URI_STUART=my_mongo_url
```

If you want to use node.js from your environment:

```bash
> npm install
> npm run dev
```

If you want it to run in a docker container

```bash
> docker-compose up
```

## API

You can either use Postman or call the API endpoints directly with bash:

To get all courier with a minimum of capacity of:45

```bash
curl --location --request GET 'http://localhost:3000/couriers/lookup' \
--header 'Content-Type: application/json' \
--data-raw '{
    "capacity_required": 45
}'
```

To add a courier:

```bash
curl --location --request POST 'http://localhost:3000/couriers' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": 66,
    "max_capacity": 24
}
'
```

To patch (only change the property we send) a courier with new max_capacity:

```bash
curl --location --request PATCH 'http://localhost:3000/couriers/change_capacity/22' \
--header 'Content-Type: application/json' \
--data-raw '{
    "max_capacity": 4
}
'
```

To delete one courier:

```bash
curl --location --request DELETE 'http://localhost:3000/couriers/66'
```

## To test the app

Run it once

```bash
> npm run test
```

Run it each time there is a change

```bash
> npm run test:watch
```

## TODO

- Add a local mongo service instead of remote one.

- In this case I used schemaLess mongoDB, if we need a proper schema we could go for an ORM like mongoose or RDBMS like mySql.

- Add Winston to save the logs.

- How about race conditions? How would you avoid race conditions if a lookup is being executed and a capacity update comes?
  I could use PubSub.

## AWS

This should be done with .travis.yml during CI/CD and Dockerrun.aws.json
