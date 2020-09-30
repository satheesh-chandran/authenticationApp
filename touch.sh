#! /bin/bash

knex migrate:latest;
knex seed:run
