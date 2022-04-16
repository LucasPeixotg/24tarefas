require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
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
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

// Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}))


// Routes
app.use('/auth', authRoute)

// 404
app.all('*', (req, res) => {
    res.status(404).render('error', { 
        code: 404,
        message: "A página que você procura não existe"
    })
})


// DB credentials
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD

// connects to the database and start listening
mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster-tasko.zowc0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(PORT)
        console.log(`Server stated, listening at port: ${PORT}`)
    })
    .catch(error => console.log(error))
