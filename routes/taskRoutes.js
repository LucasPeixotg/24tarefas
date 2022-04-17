const router = require('express').Router()
const session = require('express-session')
const loginRequired = require('../middlewares/loginRequired')

const Task = require('../models/Task')

router.get('/add', loginRequired, (req, res) => {
    res.status(200).render('tasks/add', { errorMessage: '' })
})

router.post('/add', loginRequired, async (req, res) => {
    const { title, dueDate } = req.body

    if(!title || !dueDate) {
        return res.status(422).render('tasks/add', { errorMessage: 'Preencha todos os campos' })
    }

    const task = {
        userId: req.session.user._id,
        title,
        dueDate 
    }

    try {
        await Task.create(task)        
        res.redirect('/')
    } catch(error) {
        console.log(error)
        res.status(500).render('tasks/add', { errorMessage: 'Não foi possível criar a tarefa. Por favor, tente novamente mais tarde.'})
    }
})

router.get('/complete/:id', loginRequired , async (req, res) => {
    const { id } = req.params

    try {
        const task = await Task.findById(id)
    
        if(task && task.userId == req.session.user._id) {
            await Task.findByIdAndUpdate(id, { done: !task.done })
            res.redirect('/')
        } else {
            res.status(404).render('error', { 
                code: 404,
                message: "A página que você procura não existe"
            })
        }
    } catch(error) {
        console.log(error)
        res.redirect('/')
    }
})

router.get('/delete/:id', loginRequired , async (req, res) => {
    const { id } = req.params
    await Task.findOneAndDelete({ _id: id, userId: req.session.user._id })
    res.redirect('/')
})


// 404
router.all('*', (req, res) => {
    res.status(404).render('error', { 
        code: 404,
        message: "A página que você procura não existe"
    })
})


module.exports = router