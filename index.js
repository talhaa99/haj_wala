const express = require('express');
const sequelize = require('./config');
const userRoutes = require('./routes/user');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello, World!');

});
app.use(express.json());
app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

    try {
        // Check database connection
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        // Synchronize Sequelize models with database (if needed)
        await sequelize.sync();
        console.log('Database synchronized');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});