require('dotenv').config();
const express = require('express');
require('express-async-errors');
const connectDb = require('./db/connect');
const app = express();

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('./public'));
app.use(cors());

const authRouter = require('./routes/authRoutes');
const tasksRouter = require('./routes/taskRoutes');
const { authenticateUser } = require('./middleware/authentication');

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/tasks',authenticateUser,tasksRouter);

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async()=>{
    try{
        await connectDb(process.env.MONGO_URI);
        app.listen(port, ()=>{
            console.log('Listening on 5000');
        });
    }
    catch(error){
        console.log(error);
    }
}

start();