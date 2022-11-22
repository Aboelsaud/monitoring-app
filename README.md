<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Monitor RESTFUL-API is an API for Uptime monitoring server which allows authorized users to enter URLs they want monitored, and get detailed uptime reports about their availability, response time, and total uptime/downtime.

## Api endpoints
- POST SignUp -> for create new user with email and password.
- POST Login -> for user login into the system and return the token to be used across the system.
- POST CreateCheck -> for create a check with specific url to be monitored.
- PATCH updateCheck -> for update a specific check.
- DELETE deleteCheck -> for delete a specific check.
- GET findAllChecks -> for find all checks for specific authenticated user.
- GET findCheck -> for find one check for specific authenticated user.
- GET findReports -> for find all the reports for specific check or tags for authenticated user.

## Configurations
```diff
- You have to add your .env file that contains vars that you will find in .env.example
```
## Note
- There is a postman collection in the project in order to import it in postman app and use the endpoints.
## Running the app

```bash
$ docker-compose up

# run migrations
$ docker-compose exec app bash precompile.sh
```

## Test

```bash
# unit tests
$ npm test
```

## App features
- SignUp with email verification sent to the given email.
- Stateless authentication using JWT.
- User can delete check and all reports attached to that check will be automatically deleted and the interval of that check will be stopped.
- User recieves an email whenever a url goes down.
- Users can get detailed uptime reports about their checks availability, response time, and total uptime/downtime.
- Redis is used when retrieving report status with time expiration to speed up the process instead of hitting the database every request.
- App is dockerized.


