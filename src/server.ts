import cookieParser from 'cookie-parser';
import express from 'express';
import { connectToDb } from './config/dbConn';
import  registerRouter  from '../src/routes/register'
import authRouter from '../src/routes/auth'
import logOutRouter from '../src/routes/logout'
import userRouter from '../src/routes/apis/user'
const app = express();
//connet to DB
connectToDb();

// built-in middleware
app.use(express.json());
// middleware for cookies
app.use(cookieParser());

// port number
const port = 3000;

// routes
app.use('/', registerRouter)
app.use('/', logOutRouter)
app.use('/', authRouter)
app.use('/', userRouter)

app.listen(port, async () => {
  console.log(`listening on port http://localhost:${port}`);
});