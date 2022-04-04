require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const app = express()

const PORT = 5000

// static files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))

// set views
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.status(200).render('index')
})

const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster-tasko.zowc0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(PORT)
        console.log(`Server stated, listening at port: ${PORT}`)
    })
    .catch(error => console.log(error))
