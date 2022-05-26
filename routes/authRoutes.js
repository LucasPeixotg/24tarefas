const router = require('express').Router()

const { hashPassword, comparePasswordAndHash } = require('../utils/cryptography')
const User = require('../models/User')

router.get('/register', (req, res) => {
    if(req.session.user) {
        return res.status(200).render('auth/alreadyLogged', { 
            username: req.session.user.username,
            next: 'register'
        })
    }
    res.status(200).render('auth/register', { errorMessage: '' })
})

router.get('/login', (req, res) => {
    if(req.session.user) {
        return res.status(200).render('auth/alreadyLogged', { 
            username: req.session.user.username,
            next: 'login'
        })
    }
    res.status(200).render('auth/login', { errorMessage: '' })
})

router.get('/logout', (req, res) => {
    if(req.session.user) {  
        req.session.destroy(error => {
            if(error) {
                console.log(error)
            } else {
                res.status(200)
                const { next } = req.query
                if(next) res.redirect(next)
                else res.redirect('/')
            }


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
        return res.status(422).render('auth/login', { errorMessage: "Preencha todos os campos" })
    }
    
    const user = await User.findOne({ username })
    if(user && comparePasswordAndHash(password, user.password)) {
        req.session.user = {
            _id: user._id,
            username: user.username,
            email: user.email,
        }
        
        res.redirect('/')
    } else {
        return res.status(401).render('auth/login', { errorMessage: 'Nome de usuário ou senha incorretos' })
    }
})

router.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword} = req.body

    if(!username || !password || !email || !confirmPassword) {
        return res.status(422).render('auth/register', { errorMessage: "Preencha todos os campos" })
    } else if(confirmPassword!==password) {
        return res.status(422).render('auth/register', { errorMessage: "As senhas não conferem" })
    }

    const user = { 
        username, 
        email, 
        password: hashPassword(password)
    }

    // Email or username already taken validation
    const sameUsername = await User.findOne({ username })
    const sameEmail = await User.findOne({ email })

    if(sameUsername && sameEmail) {
        return res.status(422).render('auth/register', { errorMessage: 'O nome de usuário e o email já estão em uso' })
    } else if(sameUsername) {
        return res.status(422).render('auth/register', { errorMessage: 'O nome de usuário já está em uso' })
    } else if(sameEmail) {
        return res.status(422).render('auth/register', { errorMessage: 'O email já está em uso' })
    }

    // Validation successful
    try {
        await User.create(user)
        res.redirect('/auth/login')
    } catch(error) {
        res.status(500).render('auth/register', { errorMessage: 'Não foi possível criar o usuário. Por favor, tente novamente mais tarde.'})
    }
})


// 404
router.all('*', (req, res) => {
    res.status(404).render('error', { 
        code: 404,
        message: "A página que você procura não existe"
    })
})



module.exports = router