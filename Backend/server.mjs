import express from "express"
import mongoose from "./db/userData.mjs"
import userRoutes from './routes/userRoutes.mjs'
import createTaskRoutes from './routes/createTaskRoutes.mjs'
import chalk from "chalk"
import connectToUserDb from "./db/userData.mjs"
import cors from 'cors'

//mongodb connect
connectToUserDb()

const app = express()
const port = 5000

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://signup-login-sooty.vercel.app',
    'https://signup-login-production-8cf6.up.railway.app'
  ],
  methods:['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],

}));
app.use(express.json())
app.use("/api/auth",userRoutes)
app.use("/api/tasks", createTaskRoutes)

// 192.168.0.168

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error', status });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
