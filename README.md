# Scrabble game-saver

![Build Version](https://img.shields.io/badge/Build%20Version-v0.1alpha-red.svg?style=for-the-badge)

This is a page to save your Scrabble scores and 
enjoy various statistics of your Scrabble games.
It is a project made purely for fun & it is still under construction. Visit the current version [here](https://thawing-caverns-80697.herokuapp.com/)

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites
You need to install [node.js](https://nodejs.org/en/) 14.14.0 or a later LTS release which comes with npm which comes with npm 6.14.4 or later

## Installing
Open the project in your editor and run
```
$ npm install
```

## Deployment
```
$ node app.js 
```

# Dependencies

* [body-parser 1.19.0](https://www.npmjs.com/package/body-parser)
* [fortawesome](https://fontawesome.com/)
* aws-sdk 2.817.0
* bcrypt5.0.0
* body-parser 1.19.0
* chart.js 2.9.4
* connect-mongo 3.2.0
* cors 2.8.5
* dotenv 8.2.0
* ejs 3.1.5
* express 4.17.1
* express-session 1.17.1
* https 1.0.0
* jquery 3.5.1
* lodash 4.17.20
* mongoose 5.11.8
* mongoose-encryption 2.0.3
* nodemon 2.0.6
* passport 0.4.1
* passport-google-oauth20 2.0.0
* passport-local 1.0.0
* passport-local-mongoose 6.0.1

## Database
For Database model is used MongoDB. The database is on cloud on [Mongo Atlas](https://www.mongodb.com/cloud/atlas) on AWS cloud provider on a free trier.

## Security - Login
For login is being used the passport.js with local stategy. The bcrypt library is being used for hashing users-password. Encryption is being used for users email.

## Future TODO List
* [x] Local strategy with passport.js
* [x] Session-server-side system
* [ ] Facebook & Google login system
* [ ] API to be created 