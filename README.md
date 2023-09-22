# NestJs-Restful-Todo-CRUD

___It is a simple Todo CRUD application for learning NestJs, Prisma and Swagger.___

## Todo List of Project
- [x] NestJs.
- [x] Scheduled Tasks.
- [x] Prisma.
- [ ] Prisma middlewares.
- [x] Swagger.
- [ ] Unit Test.

## Using the Application

### 1- Cloning Repository

You can clone this repository with the following command(You should have installed git globally):

```
git clone "https://github.com/M-Kia/nestjs-restful-todo-crud.git"
```

### 2- Installing dependencies

After cloning the project, use the following command to install the dependencies:

```
npm install
```

### 3- Create schema in your database

Make sure that you installed MySql before and its server is running. Then you should create the schema in your MySQL database. Also update the ".env" file for the database url.

### 4- Setup Prisma

Use the following commands to configure prisma for your project.

```
npm run prisma:generate
npm run prisma:migrate
```

### 5- Run application in development or production mode

You can open project in development environment with the following command:

```
npm run start:dev
```

If you want to just using the application, you can use the following command:

```
npm start
```

## Documentation

To check the documentation, you can go to [This Page](http://localhost:5000/api-docs) after running the application to use Swagger documentation of the project.

> Double check the port number in the url.
