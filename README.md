
[![License: GPL v2](https://img.shields.io/badge/License-GPL_v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

# TissueSample_MEAN


> You must have npm package manager and nodeJs already installed in your platform

## Goals

1. Display a list of collections on the home page (including their title and associated disease).
2. Drill into a collection’s record to view the details of their currently associated samples.
3. Add a new sample to an existing collection.
4. Create a new collection.
5. Pagination for the table
6. Deploy in the cloud

This demo has been developed by MEAN Stack.
![MEAN-Stack Image]()

### To run the application

1. Install Node 16 or later. You can use the [package manager][] of your choice.
   Tests need to pass in Node 16 and 17.
2. Clone this repository.
3. Run `npm install` to install the dependencies.
4. Run `npm start` to start the badge server.
5. Open `http://localhost:3000/` to view the frontend.

```bash
npm start
```

Code structure of the deployed app is as following<br>

```

|-server.js
|-db.js
|-package.json
|-gulpfile.js
|-certs/
|-node_modules/
|-controllers/
|-----static.js
|-----api/
|---------processes.js
|----dbmodels/
|--------dbCollections.js
|--------dbSamples.js
|-ng/
|----application.ctrl.js
|----filter.svc.js
|----interceptor.svc.js
|----module.js
|----dashboard.ctrl.js
|----dashboard.svc.js
|----routes.js
|----utils.svc.js
|-www/
|----403.html
|----404.html
|----500.html
|----home.html
|----index.html
|----login.html
|----dashboard.html
|----js/
|-------app-min.js
|----css/
|-------style.css
|----favicon/
|-------icon.png
|-------manifest.json

```

## Front-end Dependencies

| Name                                                                                          | Description                                                               |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [Bootstrap CSS](https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css)      | To have a responsive design.                                              |
| [Moment JS](https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js)            | date library for parsing, validating, manipulating, and formatting dates. |
| [AngularJS](https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.4/angular.min.js)           | To load the MVC functionality in the front-end                            |
| [Angular-route](https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.4/angular-route.min.js) | To inject the routing functionality of AngularJS                          |



## Front-end
Front-end has been implemented using AngularJs and Bootstrap. `dashboard.ctrl.js` manages the controller for `dashboard.html`. It shows the tables, response to search query, `GET` or `POST` requests to the Back-end with the help of `dashboard.svc.js`; an AngularJS service. Application controller is `application.ctrl.js` and it controls `index.html` and all associated tasks such as toasting a notification to user etc. By separting the `dashboard.ctrl.js` and `application.ctrl.js` and seting up the `routes.js`, we are able to expand the functionality in the future and maintenace will be easier. <br>
To handle 404, 403, and 500 messages, three htmls are directed by Rouprovider in `routes.js`.<br>
In addition to `Bootstrap 5.x`, I have developed a `style.css` serving additional functionality such as notification toatsers, dropdown menu, header, etc.

## Data Schema
MongoDB has been used as NRDBMS and a free Atlas account has been created to store the data. `db.js` manages the connection to the cloud-based NRDBMS. It is a free-shared service for a demo only. Two Schemas have been defined: (1) Collection, (2) Sample.

```javascript

var Collection = db.model('Collection',{
	id:{type:Number, required: true, default: 1 },              // collection id
	disease_term: {type : String, required : true},             // disease terminology
  title: {type : String, required : true},                    // title
  date:{type : Date, required : true, default : +new Date()}  // updated date  
});

var Sample = db.model('Sample',{
	id:{type:Number, required: true, default: 1 },              // sample id
	c_id: {type : Number, required : true},                     // collection id
  donor_count: {type : Number},                               // donor count
	mat_type: {type: String},                                   //material type
  date:{type : Date, required : true, default : +new Date()}  // updated date
})

```
Username and password for aformenetioned collections are as follow:
Username: TissueSampleDB <br>
Password: UniversityNottingham{2022}<br>
Link for connection to MongoDB Compass is `mongodb+srv://TissueSampleDB:UniversityNottingham{2022}@cluster0.kbrljqd.mongodb.net/TissueSampleDB`



## Back-end Dependencies

| Name                                                                      | Description                                                       |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [body-parser](https://www.npmjs.com/package/body-parser)                  | Node.js body parsing middleware.                                  |
| [express](https://www.npmjs.com/package/express)                          | Fast, unopinionated, minimalist web framework for node.           |
| [mongodb](https://www.npmjs.com/package/mongodb)                          | MongoDB NodeJS Driver                                             |
| [mongoose](https://www.npmjs.com/package/mongoose)                        | MongoDB object modeling tool supporting promise and call back     |
| [angular](https://www.npmjs.com/package/angular)                          | It contains the legacy AngularJS (1.x)                            |
| [multer](https://www.npmjs.com/package/multer)                            | A middleware for uploading files.                                 |
| [file-system](https://www.npmjs.com/package/file-system)                  | To make file opertaion APIs simple                                |
| [express-fileupload](https://www.npmjs.com/package/express-fileupload)    | Simple express middleware for uploading.                          |


### Development dependencies

| Name                                                  | Description                                                                               |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [gulp](https://www.npmjs.com/package/gulp)            | A toolkit to automate & enhance the workflow                                              |
| [minimatch](https://www.npmjs.com/package/minimatch)  | A minimal matching utility for converting blob expressions to JavaScript RegExp objects   |
| [nodemon](https://www.npmjs.com/package/nodemon)      | A module essential for Nodejs development pipeline.                                       |


## API Design by `RERTful Design Convention`

#### GET - `/getCollection/:p_id/:MaxPerPage`

This will return the Collections according to PageNumber (`p_id`) and maxuimum number of rows in each view (`MaxPerPage`). Output does also specify whether the next/previous page is also available or not.

#### GET - `/searchCollection/:query`

This will return the `Collections` according to the `query` requested.

#### POST - `/CRUDcollection`

This `Post` RESTFul API processes the request and received data and carries out all CRUD operations on `Colllection` model. It will also return a message to the user.

#### GET - `/searchSample/:query`

This will return the `Samples` according to the `query` requested.

#### POST - `/CRUDsample`

This `Post` RESTFul API processes the request and received data and carries out all CRUD operations on `Sample` model. It will also return a message to the user.



## Automation tool
Gulp is a JavaScript task runner for improving front-end and back-end development workflow. With the use of a number of gulp plugins I have automated repetitive tasks such as minification, compilation etc and composed them into efficient build pipelines.
### Tasks
The following list of tasks is preconfigured in gulpfile.js file:
1. `gulp-sourcemaps`: It automatically creates source maps from the code; usefull for debugging minified Angular apps in the browser.
2. `gulp-concat`: To concatenate the javascript with sourcemaps, it is employed.
3. `gulp-ng-annotate`: Add angularjs dependency injection annotations with ng-annotate.
4. `gulp-trim`: to trim methods/properties in JS files.
5. `gulp-minify`:  It helps automate copying files, and minifying JavaScript code. 
### To run the development mode

```bash
npm dev
```

## Cloud
### Heroku
Heroku is a platform as a service (PaaS) that enables developers to build, deliver, monitor, scale and run applications entirely in the cloud.
I have enabled the integration between Heroku and GitHub. Check the demo in following link.
<a href=""> Live Demo</a>


## TODO List
<ul>
  <li>Spell corrector for search box to increase the efficiencies</li>
  <li>Visualising the data</li>
  <li>Updating DB using CSV file upload</li>
  <li>CI/CD Pipeline using Azure DevOps</li> 
  <li>Creating same project by ASP.NET Core, AngularJS, and SQL server and then deploying in Azure PaaS</li> 
</ul>
