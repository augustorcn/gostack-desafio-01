const express = require("express");

const server = express();

server.use(express.json());

server.use((req, res, next) => {
    console.count("Quantidade de requisições");

    return next();
});

function checkProjectIdExists(req, res, next) {
    const { id } = req.params;
    const project = projects.find(p => p.id == id);

    if (!project)
        return res.status(400).json({ error : 'Project not found' });

    return next();
}

/**
 * Middleware bonus
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function checkProjectIdDontExists(req, res, next) {
    const { id } = req.body;
    const project = projects.find(p => p.id == id);

    if (project)
        return res.status(400).json({ error : 'Project already exists' });

    return next();
}

const projects = [];

server.get('/projects', (req, res) => {
    return res.json(projects);
});

server.post('/projects', checkProjectIdDontExists, (req, res) => {
    const { id, title } = req.body;

    const project = { id, title, tasks: [] };

    projects.push(project);

    return res.json(projects);
});

server.put('/projects/:id', checkProjectIdExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id == id);

    project.title = title;

    return res.json(project);
});

server.delete('/projects/:id', checkProjectIdExists, (req, res) => {
    const { id } = req.params;

    const projectIndex = projects.findIndex(p => p.id == id);

    projects.splice(projectIndex, 1);

    return res.send();
});

server.post('/projects/:id/tasks', checkProjectIdExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id == id);

    project.tasks.push(title);

    return res.json(projects);
});

server.listen(3000);