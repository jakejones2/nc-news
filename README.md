# Setup and Overview

## Welcome!

This RESTful API lets you store and retrieve json data for a news/social media website. It is built using node/express.js and PostgreSQL, and deployed on Render with ElephantSQL.

Try it out at https://nc-news-tm72.onrender.com/api !

## Summary

For a full breakdown of what this API offers, visit the link above and send a GET request to `/api`.

### GET users, topics, articles and comments on the following endpoints:

- `/api/users`
- `/api/topics`
- `/api/articles`
  - `?topic=<topic slug>`
  - `?author=<username>`
  - `?sort_by=<column name>`
  - `?order=<asc/desc>`
  - `?limit=<num of articles per page>`
  - `?p=<page number>`
- `/api/articles/:article_id`
- `/api/articles/:article_id/comments`
  - `?limit=<num of commments per page>`
  - `?p=<page number>`

## Setup

### 1 - Install node/npm/postgres

To create your own version of this project, first install the following:

- node (min v20.4.0)
- npm (min v9.7.2)
- psql (min v14.8)

### 2 - Clone the repo locally

To clone the repo, choose and navigate to a parent directory, and enter the following into the command line:

```
git clone https://github.com/jakejones2/nc-news.git
```

### 3 - Install all dependencies

Once cloned, cd into the new directory and run `npm install` to install all dependencies.

### 4 - Connect to databases with .env files

Next add two .env files for both testing and development:<br>

- `.env.development`<br>
- `.env.test`<br>

These files should be in the **top level folder** in the repository.<br><br>
Inside these .env files you must set `PGDATABASE` to your testing and development database names respectively.<br>
Make sure that these databases are created **before** running `npm run seed`.

For example, place the following inside `.env.development`:<br>

```
PGDATABASE=my_dev_database
```

This process **defines the names of your databases**. You will need to use these names to access the databases via psql and view data manually.

### 5 - Seed local databases

After creating two .env files for development and testing, run the following commands to seed local databases:

1. `npm run setup-dbs`
2. `npm run seed`

### 6 - Run all tests

To run all tests, enter `npm test` into the command line. Tests are held in the `__tests__` directory.<br><br>Be aware that jest runs tests **concurrently** by default. This will lead to errors if not handled, as each test requires uninterrupted contact with the test db. If you intend to run tests directly with jest include the `--runInBand` flag.<br><br>**Husky** is installed by default to check that all tests pass before git commits. To change this behaviour, alter the `pre-commit` file in `.husky`.

### 7 - Start a local server

To start a local server, enter `node listen.js` into the command line from the top-level directory. You should see a message saying 'Listening on port 9090'. This port can be changed by altering the `port` variable in `listen.js`.

# Usage

## Articles

### GET

GET `/api/articles` to retrieve all articles paginated in 10s.

Accepts the following queries:

- `author` requests all articles with author=users.username
- `topic` requests all articles with topic=topics.slug
- `sort_by` sorts by any columns in the articles table
- `order` can sort be ASC or DESC
- `limit` (int) determines the number of articles per page
- `p` (int) determines the page

When viewing **all** articles, results are sent as an array **without the body of each review**. To see the body of a review, send a GET request to `/api/articles/<enter article_id here>`.

### POST

POST `/api/articles` to add new articles.

Example request body to POST an article:

```
{
  author: "butter_bridge",
  title: "important new article",
  body: "something I really need to share immediately with everyone",
  topic: "cats",
}
```

The author and topic **must already exist in the database**. If these fields represent new data, and them first by sending POST requests to `/api/users` and `/api/topics`.

### PATCH

PATCH `/api/articles/:article_id` to increase an article's `votes` property.

Example request body to PATCH an article and increase its votes by 3:

```
{ inc_votes: 3 }
```

### DELETE

DELETE `/api/articles/:article_id` to delete an article. Responds with 204 (no content) upon success.

## Comments

### GET

GET `/api/articles/:article_id/comments` to get comments by `article_id`, paginated in 10s.

Accepts the following queries:

- `limit` (int) determines the number of comments per page
- `p` (int) determines the page

### POST

POST `/api/articles/:article_id/comments` to add new comments.

Example request body to POST a new comment:

```
{
    username: "butter_bridge",
    body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
}
```

### DELETE

DELETE `/api/comments/:comment_id` to delete comments. Upon success returns 204 (no content).

## Topics

GET `/api/topics` to get topics.

POST `/api/topics` to add new topics.

Example request body to POST a new topic:

```
{
    slug: "gardening",
    description: "growing stuff",
}
```

## Users

### POST

POST `/api/users` to create new users.

Example request body to POST a new user:

```
{
    username: "bob",
    name: "boris",
    avatar_url: "https://avatars3.githubusercontent.com/u/24604688?s=460&v=4",
    password: "myP@ssword",
}
```

After creating a new user, you will **never again** get access to your password, so keep it safe! To modify content related to this user, gain an access token via POST `/auth` or GET `/refresh`, and add this to your **authorization header**. For more information, see _Authorization_.

### DELETE

DELETE `/api/users/:username` to delete users.

A succesful deletion will result in a reponse status of 204 (no content). You must send an **access token** to complete this request (see _Authorization_).

## Authorization

- POST `/auth` to receive an **access token** and **refresh token cookie**.
- GET `/refresh` to receive a new **access token**.
- GET `/logout` to clear the **refresh token cookie**.

Access tokens identify you as a particular user, and one is required to perform any operation that modifies user data on the system.

Send a POST request to `/auth` to create a token. The POST body must include a valid username and password associated with a user that has **already been created** via a POST request to `/api/users`. Users are stored **indefinitely** on the server database, but all access and refresh tokens **expire**. Consider a POST to `/auth` as 'logging in' for a session.

Example POST body:

```
{
  "username": <valid_username>,
  "password": <valid_password>
}
```

If the POST request to `/auth` is successful, you will receive a status of 200 and an access token in the response body. This access token needs to be added to an **authorization header** before making requests to protected endpoints.

Example auth header:

```
Authorization: Bearer <token>
```

After sending a successful POST request to `/auth`, you will also receive a secure, http-only cookie containing a **refresh token**. This refresh token allows you to send GET requests to `/refresh` to receive a **new** access token. Access tokens will expire after one hour, whereas refresh tokens last one day, meaning frequent GET requests to `/refresh` can save you submitting and thus _exposing_ credentials regularly. Once the refresh token expires, you will have to log in again at POST `/auth`.

To **log out**, send a GET request to `/logout`. This will delete the refresh token both server side and on the client cookie.

All passwords are **hashed** and **salted** before being stored. There is currently no implementation of a password recovery system, so keep this information safe! Refresh token cookies are set to secure, so will **only be sent over HTTPS.**
