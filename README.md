# Set up backend locally

This will guide you to set up the server on your local machine. A prerequisite is that you have Node version 22 or later installed

## 1. Download MySQL Server
Download MySQL Community Server from https://dev.mysql.com/downloads/mysql/

Once downloaded, go trough the installation process and start the MySQL Server

## 2. Download MySQL Workbench
Download MySQL Workbench from https://dev.mysql.com/downloads/workbench/

Once downloaded, go trough the installation process and start the workbench

## 3. Configure MySQL in MySQL Workbench
Create a new MySQL connection. Name it whatever you want and provide user credentials. Connect and open the connection in the workbench.

### 3.1 Create MySQL Schema in MySQL Workbench
In MySQL Workbench, create a new schema. You can do this by clicking on the cylinder with a plus sign in the top navigation bar of MySQL Workbench. Name the schema whatever you want and apply.

## 4. Clone repository
Clone the repository to get all needed files

## 5. Edit config file
Locate the config.json file found in the config folder. Change the development config to match the credentials and schema name (database name) for your local MySQL Server.

## 6. Create .env file
To get user endpoints and auth working, create a .env file. In the .env file you need to specify the JWT secret like this:

```JWT_SECRET="SECRET"```

## 7. Install dependecies
Open your terminal inside the root folder and run the following command

```npm install```

## 8. Run the server
Once everything is setup, you can run the following command in your terminal (make sure your terminal location is the root folder):

```npm run start```

## 9. Test the server
When you start the server, a script will automatically create the tables and so on. If there are no errors in your terminal when starting the server, you can use Postman to test it.

For example, create a user using the following endpoint:

```POST http://localhost:1234/auth/register```

Body for the request:

```
{
  "username": "user",
  "password": "123"
}
```

If everthing is working, it should return the id for the newly created user
