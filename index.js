require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const app = express()

const authRoute = require('./routes/authRoutes')

const PORT = 5000

// Static files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))

// Set views
app.set('views', './views')
app.set('view engine', 'ejs')

// JSON middlewares
app.use(express.urlencoded());
app.use(express.json());

// Routes
app.use('/auth', authRoute)

const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster-tasko.zowc0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(PORT)
        console.log(`Server stated, listening at port: ${PORT}`)
    })
    .catch(error => console.log(error))
