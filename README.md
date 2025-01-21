**Stack**
Express - Node.js
MongoDb - NOSQL Database
JavaScript
HTML
CSS

**MVC Architecture**: Model View Controller

Express.js:
Wrapper library around Node.js for added features and easy usage of Node.js code.

MongoDb:
Setup Mongo Atlas
Connect the Mongo driver to Application using connection string
Use Mongoose (Object Data Modelling) library for writing code

REST API : Representational State Transfer for CRUD (create, read, update, delete) operations.

DevDependencies:
Prettier - formatting code
ESLint - ensuring and enforcing coding standards
Nodemon - tool to restart server autoamatically whenever there is a change in application

Debuggers:
Morgan - for incoming request url logging
ndb - for node debugger in shadow chrome

Authentication & Authorization:
jsonwebtoken - for generating and verifying tokens on sign in and login
bcryptjs - for encryption the password before sending to Database
crypto - encryting the password reset token
nodemailer - to send email to the user

Security:
express-rate-limit - for limiting the number of requests from an single IP address
helmet - to set important http headers
express-mongo-sanitize - to sanitize the incoming request body to avoid queries to DB
xss-clean - to sanitize the incoming html code in request body
hpp - http parameter pollution, to clear the query string in req url, avoiding duplicates

Additional tools:
Mailtrap - for recieving mails from node application
