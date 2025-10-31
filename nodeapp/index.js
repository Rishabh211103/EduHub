const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path')
const morgan = require('morgan')
require('dotenv').config()

const userRoutes = require('./routers/userRouter');
const courseRoutes = require('./routers/courseRouter');
const materialRoutes = require('./routers/materialRouter');
const enrollmentRoutes = require('./routers/enrollmentRouter');
const { validateToken } = require('./authUtils');
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

const logStream = fs.createWriteStream(path.join(__dirname, 'logs.log'), { flags: 'a' });
app.use(morgan('combined', { stream: logStream }));

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));


const uploadDir = path.resolve(__dirname, './uploads')

app.use('/uploads', express.static(uploadDir))
app.use('/users', userRoutes);
app.use('/courses', validateToken, courseRoutes);
app.use('/materials', validateToken, materialRoutes);
app.use('/enrollments', validateToken, enrollmentRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});