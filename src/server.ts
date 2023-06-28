import dotenv from 'dotenv';
dotenv.config();
import { AppDataSource } from "./data-source"
import express from 'express';
import identityRoutes from "./routes/identityRoutes";

const app = express();

AppDataSource.initialize().then(async () => {
    console.log("Database successfully connected...")
})


// Set JSON format for HTTP requests
app.use(express.json());

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger_output.json');

// Endpoints
app.get('/', (req, res) => {res.status(200).json({ response: true });});
app.use('/', identityRoutes);
app.use('/identity-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server is running...'));

export default app;