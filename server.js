const express = require('express');
const app = express();
const PORT = 3000;

// Built-in middleware (Exercise 2)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Logger middleware
const logger = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
};
app.use(logger);

// Request time middleware
const addRequestTime = (req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
};
app.use(addRequestTime);

// Auth middleware
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No authorization header' });
    }
    next();
};

// ─── Task 20.2 Exercise 1: Custom error class + async handler ───
class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// ─── Task 20.2 Exercise 2: Validation middleware ───
const validatePost = (req, res, next) => {
    const { title, content, author } = req.body;
    const errors = [];

    if (!title || title.length < 3) {
        errors.push('Title must be at least 3 characters');
    }
    if (!content || content.length < 10) {
        errors.push('Content must be at least 10 characters');
    }
    if (!author) {
        errors.push('Author is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

let posts = [
    { id: 1, title: "Getting Started with Node.js", content: "Node.js is a JavaScript runtime...", author: "John Doe", createdAt: "2026-01-15T10:00:00Z", likes: 10 },
    { id: 2, title: "Express.js Fundamentals", content: "Express is a web framework...", author: "Jane Smith", createdAt: "2026-01-16T14:30:00Z", likes: 15 }
];

let nextId = 3;

app.get('/', (req, res) => res.send('Welcome to CommunityHub API'));
app.get('/about', (req, res) => res.send('CommunityHub - A community platform'));
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

// Exercise 1: time route
app.get('/api/time', (req, res) => {
    res.json({ requestTime: req.requestTime });
});

// Exercise 1: error test route
app.get('/api/error-test', (req, res, next) => {
    try {
        throw new ApiError('Something went wrong', 500);
    } catch (error) {
        next(error);
    }
});

app.get('/api/posts', (req, res) => {
    const { author, sort } = req.query;
    let result = [...posts];
    if (author) result = result.filter(p => p.author.toLowerCase().includes(author.toLowerCase()));
    if (sort === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sort === 'popular') result.sort((a, b) => b.likes - a.likes);
    res.json(result);
});

app.get('/api/posts/:id', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
});

// validatePost added to this route (Exercise 2)
app.post('/api/posts', validatePost, (req, res) => {
    const { title, content, author } = req.body;
    const newPost = { id: nextId++, title, content, author, createdAt: new Date().toISOString(), likes: 0 };
    posts.push(newPost);
    res.status(201).json(newPost);
});

app.put('/api/posts/:id', (req, res) => {
    const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (postIndex === -1) return res.status(404).json({ error: 'Post not found' });
    const { title, content } = req.body;
    posts[postIndex] = { ...posts[postIndex], title: title || posts[postIndex].title, content: content || posts[postIndex].content, updatedAt: new Date().toISOString() };
    res.json(posts[postIndex]);
});

app.delete('/api/posts/:id', (req, res) => {
    const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (postIndex === -1) return res.status(404).json({ error: 'Post not found' });
    posts.splice(postIndex, 1);
    res.status(204).send();
});

app.patch('/api/posts/:id/like', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).json({ error: 'Post not found' });
    post.likes++;
    res.json(post);
});

// Protected routes
app.get('/api/protected', requireAuth, (req, res) => {
    res.json({ message: 'This is protected data' });
});
app.use('/api/admin', requireAuth);

// 404 catch-all
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// ─── Task 20.2 Exercise 1: Error handling middleware (must be last!) ───
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        error: { message, status: statusCode }
    });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));