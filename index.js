// implement your API here
const express = require('express');

const Users = require('./data/db');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.json({ hello: 'Node-Api1-Project is running' })
});

// view list of users
// GET	/api/users	Returns an array of all the user objects contained in the database.

server.get('/api/users', (req, res) => {
    Users.find().then(users => {
        res.status(200).json(users)
    }).catch(err => {
        console.log(err)
        res.status(500).json({ errorMessage: 'The users information could not be retrieved'})
    })
})

// view list of users by id
// GET	/api/users/:id	Returns the user object with the specified id.
server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;

    Users.findById(id).then(user => {
        if (!user) {
            res.status(404).json({ message: 'The user with the specified ID does not exist.' })
        } else {
            res.status(200).json(user)
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({ errorMessage: 'The user informstion could not be retrieved.' })
    })
})

// add new user
// POST	/api/users	Creates a user using the information sent inside the request body.
server.post('/api/users', (req, res) => {
    const { name, bio } = req.body;
    Users.insert({name, bio}).then(user => {
        if (name && bio) {
            res.status(201).json(user)
        } else {
            res.status(400).json({ message: 'Please provide name and bio for the user.' })
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({ errorMessage: 'There was an error while saving the user to the database' })
    })
})

// delete a user by id
// DELETE	/api/users/:id	Removes the user with the specified id and returns the deleted user.
server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    Users.remove(id).then(removed => {
        if(id) {
            res.status(200).json(removed)
        } else {
            res.status(404).json({ message: 'The user with the specified ID does not exist.' })
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({ errorMessage: 'The user could not be removed' })
    })
})

// update user by id
// PUT	/api/users/:id	Updates the user with the specified id using data from the request body. Returns the modified document, NOT the original.

server.put('/api/users/:id', (req, res) => {
    const {id} = req.params;
    const {name, bio} = req.body;
    if(!name || !bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    }
        Users.update(id, {name, bio})
        .then(updated => {
            if (updated) {
                Users.findById(id)
                .then(user => {
                    res.status(200).json(user)
                })   
        } else {
            res.status(404).json({ message: 'The user with the specified ID does not exist.' })
        }})
        .catch(err => {
            console.log(err)
            res.status(500).json({ errorMessage: 'The user information could not be modified.' })
        })
    })

// server.put('/api/users/:id', (req, res) => {
//     const { id } = req.params.id;
//     const { name, bio } = req.body;
//     Users.update(id, {name, bio}).then(user => {
//         if (!id){
//             res.status(404).json({ message: 'The user with the specified ID does not exist.' })
//         } else if (!name || !bio){
//             res.status(400).json({ errorMessage: 'Please provide name and bio for the user.'})
//         } else {
//             res.status(200).json(user)
//         }
//     }).catch(err => {
//         console.log(err)
//         res.status(500).json({ errorMessage: 'The user information could not be motified.' })
//     })
// })

  
const port = 5000;
server.listen(port, () => console.log(`\n** API on port ${port} \n`));