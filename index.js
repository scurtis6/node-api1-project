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
        if (user) {
            res.status(200).json(user)
        } else {
            res.status(404).json({ message: 'The user with the specified ID does not exist.' })
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
    // if (newUser.name && newUser.bio) {
    //     Users.insert(newUser).then(user => {
    //         res.status(201).json(user)
    //     }).catch()
    // }
})
// DELETE	/api/users/:id	Removes the user with the specified id and returns the deleted user.
// PUT	/api/users/:id	Updates the user with the specified id using data from the request body. Returns the modified document, NOT the original.

const port = 5000;
server.listen(port, () => console.log(`\n** API on port ${port} \n`));