require('dotenv').config();

const app = require('./src/app');

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(`Running in ${NODE_ENV} mode`);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});