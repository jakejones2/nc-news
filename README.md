# nc-news API

## Welcome!

This api lets you store and retrieve json data for a news website.<br> It is built using node/express.js and PostgreSQL, and deployed on Render with ElephantSQL.<br>
Try it out at https://nc-news-tm72.onrender.com/api !

## Summary

For a full breakdown of what this api offers, visit the link above at:

```
GET /api
```

### CRUD Operations and Endpoints:

#### GET users, topics, articles and comments on the following endpoints:

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

#### POST `/api/articles` to add articles:

Example POST body to add a new article:

```
{
  author: "butter_bridge",
  title: "important new article",
  body: "something I really need to share immediately with everyone",
  topic: "cats",
}
```

Author and topic must already exist in the database.

#### PATCH `/api/articles/:article_id` to increase an article's `votes` property:

Example PATCH body to increase votes by 3:

```
{ inc_votes: 3 }
```

#### DELETE `/api/articles/:article_id` to delete an article (responds with 204).

#### POST `/api/articles/:article_id/comments` to add comments:

Example POST body to add a new comment:

```
{
    username: "butter_bridge",
    body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
}
```

#### DELETE `/api/comments/:comment_id` to delete comments

#### POST `/api/topics` to add topics:

Example POST body to add a new topic:

```
{
    slug: "gardening",
    description: "growing stuff",
}
```

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
