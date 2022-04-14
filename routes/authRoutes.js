const router = require('express').Router()
const User = require('../models/User')

router.get('/register', (req, res) => {
    res.status(200).render('register', { message: '' })
})

router.get('/login', (req, res) => {
    res.status(200).render('login')
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body
    
    if(username===null || password===null) {
        res.status(422).render('login', { message: 'missing required fields' })
        return
    }

    const user = { username, password }
    
    try {
        let userWithSameUsername = await User.findOne({ username: username })
        if(userWithSameUsername) {
            return res.status(422).json({ message: 'username is already taken' })
        }
        
        await User.create(user)
        res.status(200).json({ message: 'user created' })
    } catch(error) {
        res.status(500).json('could not create account')
    }
})

router.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword} = req.body
    
    if(!username || !password || !email || !confirmPassword) {
        return res.status(422).render('register', { message: "Preencha todos os campos" })
    } else if(confirmPassword!==password) {
        return res.status(422).render('register', { message: "As senhas não conferem" })
    }

    const user = { username, email, password }
    
    try {
        let userWithSameUsername = await User.findOne({ username: username })
        if(userWithSameUsername) {
            return res.status(422).json({ message: 'username is already taken' })
        }
        
        await User.create(user)
        res.status(200).json({ message: 'user created' })
    } catch(error) {
        res.status(500).json('could not create account')
    }
})

module.exports = router