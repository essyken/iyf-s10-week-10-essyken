## Week 10: CommunityHub API

## Author
- Name: ESTHER WANJIRU NJOROGE
- GitHub: @essyken
- Date: May 12, 2026

## Project Description
A RESTful backend API built with Node.js and Express, serving as the server-side engine for the CommunityHub platform. The API supports full CRUD operations on posts, query filtering, middleware, error handling, and a modular MVC-style project structure — marking the first step into full-stack development.

## Technologies Used
- Node.js
- Express.js
- JavaScript (ES6+)
- dotenv (environment variables)
- Postman / Thunder Client (API testing)

## Features
- Full CRUD API for posts (GET, POST, PUT, DELETE, PATCH)
- Like a post via PATCH /api/posts/:id/like
- Filter posts by author (?author=) and sort by newest or most popular (?sort=)
- Search and pagination support on the posts endpoint
- Comments endpoint: list, add, and delete comments per post
- Custom logger middleware that logs method, URL, and timestamp
- Validation middleware that checks required fields before creating/updating posts
- Centralised error handling middleware with custom ApiError class
- Environment variables via .env and dotenv
- Modular project structure with separate routes, controllers, and middleware

## Project Structure
```
iyf-s10-week-10-essyken/
├── src/
│   ├── routes/
│   │   ├── index.js
│   │   ├── posts.js
│   │   └── users.js
│   ├── middleware/
│   │   ├── logger.js
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── controllers/
│   │   ├── postsController.js
│   │   └── usersController.js
│   ├── data/
│   │   └── store.js
│   └── app.js
├── server.js
├── .env
├── .env.example
├── .gitignore
└── package.json
```


## How to Run
- Clone this repository
- bash   git clone https://github.com/essyken/iyf-s10-week-10-essyken.git

- Navigate into the project folder

- bash   cd iyf-s10-week-10-essyken

- Install dependencies

- bash   npm install

- Set up environment variables

- bash   cp .env.example .env

- Start the server

- bash   node server.js

** The API will be running at http://localhost:3000
## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/posts | Get all posts (supports ?author=, ?sort=, ?search=, ?page=, ?limit=) |
| GET | /api/posts/:id | Get a single post |
| POST | /api/posts | Create a new post |
| PUT | /api/posts/:id | Update a post |
| DELETE | /api/posts/:id | Delete a post |
| PATCH | /api/posts/:id/like | Like a post |
| GET | /api/posts/:id/comments | Get comments on a post |
| POST | /api/posts/:id/comments | Add a comment to a post |
| DELETE | /api/posts/:id/comments/:commentId | Delete a comment |
| GET | /api/health | API health check |

## Lessons Learned
- How Node.js runs JavaScript outside the browser using the V8 engine and built-in modules like fs and path
- How Express handles routing with route parameters (req.params) and query strings (req.query)
- How middleware works in the request-response cycle and how to chain multiple middleware functions using next()
- How to structure a backend project using an MVC pattern with separate routes, controllers, and a data layer
- How to handle errors gracefully with a custom ApiError class and a centralised error-handling middleware
- How to use dotenv to manage environment variables and keep secrets out of version control

## Challenges Faced

- Async error handling: Errors thrown inside async route handlers were not caught by the global error middleware by default; solved by wrapping async handlers with an asyncHandler utility that calls next(error) on rejection.
- Middleware order: Placing the error-handling middleware before some routes caused it to be skipped; learned that error handlers must always be registered last in app.js.
- Modular routing: Splitting routes across multiple files and mounting them correctly with app.use('/api', routes) took some trial and error to get the path prefixes right.
- In-memory data resets: Data is lost every time the server restarts since there is no database yet; worked around this by seeding the store with sample posts on startup.
