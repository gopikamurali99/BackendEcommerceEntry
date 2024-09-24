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
const allowedOrigins = ['http://localhost:5173', 'https://frontend-ecommerce-entry-zq9x.vercel.app'];
// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // Check if the origin is in the allowed list
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: 'GET,POST,PUT,PATCH,DELETE',
  credentials: true, // If using cookies or session-based auth
}));



connectionString()  // connecting with mongodb

app.use(express.json());
app.use(cookieParser())
app.use('/',routes)
app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

