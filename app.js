import 'dotenv/config';
import express from 'express'
//import routes from './Routes/index.js'
import { connectionString } from './config/db_connect.js'
import cors from 'cors'
import routes from './Routes/index.js'
import cookieParser from 'cookie-parser';
//import dotenv from 'dotenv';
//import helmet from 'helmet'
//import limiter from './middlewares/rateLimitMiddleware.js'
const app = express()
const port = process.env.PORT

const corsOptions = {
  origin: 'http://localhost:5173', // Specify the allowed origin
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};



connectionString()  // connecting with mongodb

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser())
app.use('/',routes)
app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

