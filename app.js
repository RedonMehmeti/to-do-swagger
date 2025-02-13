const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Dokumentacioni',
      version: '1.0.0',
      description: 'Dokumentacioni për API-të',
    },
    servers: [
      {
        url: 'http://localhost:2000', // Corrected port to match the app
      },
    ],
  },
  apis: ['./app.js'], // Path to the API docs in your code
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

let todos = [];

// GET method to retrieve all tasks
app.get('/todos', (req, res) => {
  res.json(todos);

  /**
   * @swagger
   * /todos:
   *   get:
   *     summary: Merr të gjithë taskat
   *     responses:
   *       200:
   *         description: Lista e taskave
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                   text:
   *                     type: string
   *                   completed:
   *                     type: boolean
   */
});

// POST method to create a new task
app.post('/todos', (req, res) => {
  const newTodo = { id: Date.now(), text: req.body.text, completed: false };
  todos.push(newTodo);
  res.json(newTodo);

  /**
   * @swagger
   * /todos:
   *   post:
   *     summary: Shto një task të ri
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               text:
   *                 type: string
   *     responses:
   *       200:
   *         description: Tasku i ri është krijuar
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 text:
   *                   type: string
   *                 completed:
   *                   type: boolean
   */
});

// PUT method to update an existing task
app.put('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const todoIndex = todos.findIndex(todo => todo.id === todoId);

  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  todos[todoIndex] = { 
    ...todos[todoIndex], 
    text: req.body.text || todos[todoIndex].text,
    completed: req.body.completed !== undefined ? req.body.completed : todos[todoIndex].completed
  };

  res.json({ message: 'Task updated successfully', todo: todos[todoIndex] });
});




app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    res.send({ id, name });
  });
  
  /**
   * @swagger
   * /todos/{id}:
   *   put:
   *     summary: Shto një task të ri
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID e product
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *     responses:
   *       200:
   *         description:Nje product u shtua
   */
  app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    res.send({ id, name });
  });
  



// DELETE method to remove a task by ID
app.delete('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const index = todos.findIndex(todo => todo.id === todoId);

  if (index === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  todos.splice(index, 1);
  res.json({ message: `Task with ID ${todoId} was deleted` });

  /**
   * @swagger
   * /todos/{id}:
   *   delete:
   *     summary: Fshij një task
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID e taskut
   *     responses:
   *       200:
   *         description: Tasku është fshirë
   */
});

app.listen(2000, () => {
  console.log('Server is running on http://localhost:2000');
});

module.exports = app;