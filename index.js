require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const app = express()

const authRoutes = require('./routes/authRoutes')
const taskRoutes = require('./routes/taskRoutes')

const loginRequired = require('./middlewares/loginRequired')
const Task = require('./models/Task')
const { sortTasksByDoneAndDate } = require('./utils/sortTasks')

const PORT = process.env.PORT || 8080

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


// Home Route
app.get('/', loginRequired, async (req, res) => {
    await Task.deleteMany({ deleteDate: {$lt: Date.now()-5} })
    
    const tasks = await Task.find({ userId: req.session.user._id })
    tasks.sort(sortTasksByDoneAndDate)

    res.status(200).render('home', { tasks })
})


// Routes
app.use('/auth', authRoutes)
app.use('/tasks', taskRoutes)

// 404
app.all('*', (req, res) => {
    res.status(404).render('error', { 
        code: 404,
        message: "A página que você procura não existe"
    })
})

// DB credentials
const uri = process.env.DB_URI

// connects to the database and start listening
mongoose.connect(uri)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server started, listening at port: ${PORT}`)
        })
    })
    .catch(error => console.log(error))
