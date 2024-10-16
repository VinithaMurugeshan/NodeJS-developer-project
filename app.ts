import express from 'express';
import userRoutes from './routes/UserRoute';
import sequelize from './config';
import { errorHandler } from './Middleware/errorhandler';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use('/api', userRoutes);
app.use(errorHandler); 

const startServer = async () => {
    try {
        await sequelize.sync(); // Sync with the database
        console.log('Database synced successfully.');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();
