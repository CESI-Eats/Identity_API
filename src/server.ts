import dotenv from 'dotenv';
import { AppDataSource } from "./data-source"
import express from 'express';
import userRoutes from "./routes/userRoutes";

dotenv.config();
const app = express();

AppDataSource.initialize().then(async () => {
    console.log("Database successfully connected...")
}).catch(error => console.log(error))


// Set JSON format for HTTP requests
app.use(express.json());

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger_output.json');

// Endpoints
app.get('/', (req, res) => {res.status(200).json({ response: true });});
app.use('/users', userRoutes);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server is running...'));

export default app;