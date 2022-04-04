require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const app = express()

const PORT = 5000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).json({ message: 'initial page' })
})

const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster-tasko.zowc0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(PORT)
        console.log(`Server stated, listening at port: ${PORT}`)
    })
    .catch(error => console.log(error))
