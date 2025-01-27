## Stack

- Express - Node.js
- MongoDb - NOSQL Database
- JavaScript
- HTML - Pug
- CSS

### MVC Architecture: Model View Controller

### Express.js

- Wrapper library around Node.js for added features and easy usage of Node.js code.

### MongoDB

- Setup Mongo Atlas
- Connect the Mongo driver to Application using connection string
- Use Mongoose (Object Data Modelling) library for writing code

### REST API

- Representational State Transfer for CRUD (create, read, update, delete) operations.

## DevDependencies

- Prettier &rarr; formatting code
- ESLint &rarr; ensuring and enforcing coding standards
- Nodemon &rarr; tool to restart server autoamatically whenever there is a change in application

## Debuggers

- Morgan &rarr; for incoming request url logging
- ndb &rarr; for node debugger in shadow chrome

## Authentication & Authorization

- jsonwebtoken &rarr; for generating and verifying tokens on sign in and login
- bcryptjs &rarr; for encryption the password before sending to Database
- crypto &rarr; encryting the password reset token
- nodemailer &rarr; to send email to the user

## Security

- express-rate-limit &rarr; for limiting the number of requests from an single IP address
- helmet &rarr; to set important http headers
- express-mongo-sanitize &rarr; to sanitize the incoming request body to avoid queries to DB
- xss-clean &rarr; to sanitize the incoming html code in request body
- hpp &rarr; http parameter pollution, to clear the query string in req url, avoiding duplicates

## Additional tools

| Package     | Usage                                                  |
| ----------- | ------------------------------------------------------ |
| Pug         | Template engine for html in node.js for rendering page |
| Maptiler    | To display map in frontend                             |
| dotenv      | Loads environment variable into process.env            |
| Webpack     | Module Bundler to bundle js files                      |
| axios       | Http client for browser and Node.js                    |
| cookie-parser|url encoder                                            |
| multer      | handle multi part form data, upload files in form      |
| sharp       | Image processing libray for Node                       |
| html        | to convert html to text to send in email               |
| stripe      | for payment handling                                   |
| compression | compress files to send to client                       |

------------------------------------------------------

## Getting Started

First, run the development server in local environment:

```
npm install
```

```bash {"id":"01J87GXRV8DR630E7P4J99K6DD"}
npm run dev
```

Open http://localhost:3000 with your browser to see the result.
