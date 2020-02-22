const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth')

// Initializing models
const Story = mongoose.model('stories')
const User = mongoose.model('users')


router.get('/add',ensureAuthenticated, (req,res) => {
    res.render('stories/add')
})

router.post('/',ensureAuthenticated, (req, res) => {
    
    let errors = []
    let allowComments

    if(!req.body.title) {
        errors.push({text: 'Please enter title'})
    }

    if(!req.body.body) {
        errors.push({text: 'Please enter your story'})
    }

    if(errors.length > 0) {
        res.render('./stories/add', {
            title: req.body.title,
            body: req.body.body,
        })
    } else {
       if(req.body.allowComments) {
           allowComments = true
       } else {
           allowComments = false
       }

       let newStory = {
           title: req.body.title,
           body: req.body.body,
           status: req.body.status,
           allowComments: allowComments,
           user: req.user.id
       }
       new Story(newStory)
        .save()
        .then(story => {
            res.redirect(`/stories`)
        })
        .catch(err => {
            console.log(err)
        }) 
    }

})

router.get('/', (req,res) => {
    Story.find({status: 'public'})
    .populate('user')
    .sort({date: 'desc'})
        .then(stories => {
            res.render('./stories/index', {
                stories: stories
        })
    })
})

router.get('/show/:id', (req,res) => {
    Story.findOne({_id: req.params.id})
        .populate('user')
        .populate('comments.commentUser')
        .then(story => {
            if(story.status == 'public') {
                res.render('./stories/show', {
                    story: story
                })
            } else {
                if(req.user) {
                    if(req.user.id == story.user._id) {
                        res.render('./stories/show', {
                            story: story
                        })
                    } else {   
                        res.redirect('/stories')
                    }
                } else {
                    res.redirect('/stories')
                }
            }
    })
})




router.get('/edit/:id',ensureAuthenticated, (req,res) => {
    Story.findOne({_id: req.params.id})
    .then(story => {
       if(story.user != req.user.id) {
        res.redirect('/stories')
       } else {
        res.render('./stories/edit', {
            story: story
        })
    }
})   
})

router.put('/:id', (req,res) => {
    Story.findOne({_id: req.params.id})
    .then(story => {

        let allowComments

        if(req.body.allowComments) {
            allowComments = true
        } else {
            allowComments = false
        }
        
        story.title = req.body.title
        story.body = req.body.body
        story.allowComments = allowComments
        story.status = req.body.status

        story.save()
            .then(() => {
                res.redirect('/dashboard')
            })
            .catch(err => {
                res.redirect('/edit/:id')
        })
    })
})

router.delete('/:id', (req, res) => {
    Story.deleteOne({
        _id: req.params.id
    }).then(res.redirect('/dashboard'))
})

router.post('/comment/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .then(story => {
        let newComment = {
            commentBody : req.body.commentBody,
            commentUser : req.user.id
        }

        // Add to comments array
        story.comments.unshift(newComment)

        story
        .save()
        .then((story) => {
            res.redirect(`/stories/show/${story.id}`)
        })

    })
})

router.get('/user/:userId', (req,res) => {
    Story.find({user : req.params.userId, status: 'public'})
    .populate('user')
    .then(stories => {
        res.render('./stories/index',{
            stories: stories
        })
        console.log(stories)
    })   
})

router.get('/my',ensureAuthenticated, (req,res) => {
    Story.find({user : req.user.id})
    .populate('user')   
    .then(stories => {
        res.render('./stories/index',{
            stories: stories
        })
        console.log(stories)
    })   
})



module.exports = router