// implement your posts router here
const express = require('express')

const router = express.Router()

const Posts = require('./posts-model')

// [GET] /api/posts *** in server.js we have /api/posts and so we don't need to declare it here*** (Returns an array posts.)
router.get('/', async (req, res) => {
    // const users = await User.find()
    // res.json(users)
    Posts.find()
        .then(posts => {
            console.log(posts)
            res.status(200).json(posts)
        }).catch(err => {
            res.status(500).json({ message: "The posts information could not be retrieved" })
        })
})

// [GET] /api/posts:id (Returns the post object with the specified id)
router.get('/:id', (req, res) => {
    const { id } = req.params;
    Posts.findById(id)
        .then(post => {
            if (!post) {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else {
                res.status(200).json(post)
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The post information could not be retrieved" })
        })
})

// [POST] /api/posts (Creates a post using the information sent inside the request body.)
router.post('/', async (req, res) => {
    const data = req.body
    if (!data.title || !data.contents) {
        res.status(400).json({ message: "Please provide title and contents for the post" })
    } else {
        Posts.insert(data)
            .then(newPost => {
                res.status(201).json(newPost)
            })
            .catch(err => {
                res.status(500).json({ message: "There was an error while saving the post to the database" })
            })
    }

})

// [PUT] /api/posts:id (Updates the post with the specified id using data from the request body. Returns the modified post)
router.put('/:id', async (req, res) => {
    const { id } = req.params
    const changes = req.body

    try {
        if (!changes.title || !changes.contents) {
            res.status(400).json({ message: "Please provide contents and title for the post" })
        } else {
            const updatedPost = await Posts.update(id, changes)
            if (!updatedPost) {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else {
                res.status(200).json(updatedPost)
            }
        }
    } catch (err) {
        res.status(500).json({ message: "The post information could not be modified" })
    }
})

// [DELETE] /api/posts:id (	Removes the post with the specified id and returns the deleted post)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const deletedPost = await Posts.remove(id)
        if (!deletedPost) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            res.status(201).json(deletedPost)
        }

    } catch (err) {
        res.status(500).json({ message: "The post could not be removed" })
    }
})

// [GET] /api/posts/:id/comments (Gets the comment for the specified id post)
router.get('/:id/comments', (req, res) => {
    const { id } = req.params;
    Posts.findPostComments(id)
        .then(post => {
            if (!post) {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else {
                res.status(200).json(post)
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The comments information could not be retrieved" })
        })
})
module.exports = router;