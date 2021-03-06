const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = require('./knexfile.js');
const db = knex(knexConfig.development);
const server = express();

server.use(express.json());
server.use(helmet());

server.get('/api/projects', (req, res) => {
    db('projects')
    .then(projects => {
        res.status(200).json(projects)
    })
    .catch(err => {
        res.send(err.message)
    })
})

server.post('/api/projects', (req, res) => {
    const project = req.body;
    db.insert(project)
      .into('projects')
      .then(id => {
        res.status(201).json(id)
      })
      .catch(err => res.send(err.message))
})

server.get('/api/actions', (req, res) => {
    db('actions')
    .then(actions => {
        res.status(200).json(actions)
    })
    .catch(err => {
        res.send(err.message)
    })
})


server.post('/api/actions', (req, res) => {
    const action = req.body;
    db.insert(action)
      .into('actions')
      .then(id => {
        res.status(201).json(id)
      })
      .catch(err => res.send(err.message))
})

server.get('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    const projectId = { id };
    const noid = req.params.id;
    db('projects').where(projectId).first()
    .then(project => {
        if(!project){
            res.status(404)
        }
    db('actions').where('project_id', noid)
    .then(actions => {
        project.actions = actions
        res.json(project)
        })
    })
    .catch(err => {
        res.send(err.message)
    })
 });




const port = 7000;
server.listen(port, () => {
    console.log(`Server started on port ${port}!`)
})