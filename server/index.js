import express from 'express';
import mongoose, { mongo } from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB');
    }).catch((err) => { console.log(err) })


const app = express();


app.use(express.json());

app.use('/server/user', userRouter);
app.use('/server/auth', authRouter);


//Middleware para errores
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    return res.status(statusCode).json({
      success:false,
      statusCode,
      message,  
    });
});





app.listen(3000, () => {
    console.log('Server is running on port 3000');
    }
);