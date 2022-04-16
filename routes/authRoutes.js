const router = require('express').Router()

const { hashPassword, comparePasswordAndHash } = require('../utils/cryptography')
const User = require('../models/User')

router.get('/register', (req, res) => {
    res.status(200).render('register', { errorMessage: '' })
})

router.get('/login', (req, res) => {
    if(req.session.user) {
        res.status(200).render('alreadyLogged', { username: req.session.user.username })
    }
    res.status(200).render('login', { errorMessage: '' })
})

router.get('/logout', (req, res) => {
    if(req.session.user) {  
        req.session.destroy(error => {
            if(error) console.log(error)

            const { next } = req.query
            if(next) res.redirect(next)
            else res.redirect('/')
        })
    } else {
        res.status(404).render('error', { 
            code: 404,
            message: "A página que você procura não existe"
        })
    }
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body
    
    if(!username || !password) {
        return res.status(422).render('login', { errorMessage: "Preencha todos os campos" })
    }
    
    const user = await User.findOne({ username })
    if(comparePasswordAndHash(password, user.password)) {
        req.session.user = {
            _id: user._id,
            username: user.username,
            email: user.email,
        }
        
        res.redirect('/')
    } else {
        return res.status(401).render('login', { errorMessage: 'Nome de usuário ou senha incorretos' })
    }
})

router.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword} = req.body

    if(!username || !password || !email || !confirmPassword) {
        return res.status(422).render('register', { errorMessage: "Preencha todos os campos" })
    } else if(confirmPassword!==password) {
        return res.status(422).render('register', { errorMessage: "As senhas não conferem" })
    }

    const user = { 
        username, 
        email, 
        password: hashPassword(password)
    }

    try {
        // Email or username already taken validation
        const sameUsername = await User.findOne({ username })
        const sameEmail = await User.findOne({ email })

        if(sameUsername && sameEmail) {
            return res.status(422).render('register', { errorMessage: 'O nome de usuário e o email já estão em uso' })
        } else if(sameUsername) {
            return res.status(422).render('register', { errorMessage: 'O nome de usuário já está em uso' })
        } else if(sameEmail) {
            return res.status(422).render('register', { errorMessage: 'O email já está em uso' })
        }

        // Sign-up successful
        await User.create(user)
        res.status(200).render('home', { message: 'Usuário criado com sucesso' })

    } catch(error) {
        res.status(500).render('register', { errorMessage: 'Não foi possível criar o usuário. Por favor, tente novamente mais tarde.'})
    }
})

module.exports = router