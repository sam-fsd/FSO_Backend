const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

morgan.token('body', (req, res) => JSON.stringify(req.body));

const app = express();

app.use(express.json());
app.use(cors());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get('/api/persons', (req, res) => {
  res.send(JSON.stringify(persons));
});

app.get('/info', (req, res) => {
  const dateTime = new Date().toString();
  const info = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${dateTime}</p>`;
  res.send(info);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);
  if (person) {
    res.send(JSON.stringify(person));
  } else {
    res.statusMessage = 'The person with that id was not found';
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const findPerson = persons.find((person) => person.id === id);
  persons = persons.filter((p) => p.id !== id);

  return res.status(200).json({ ...findPerson });
});

app.post('/api/persons', (req, res) => {
  const id = Math.floor(Math.random() * 100);
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({ error: 'Missing the name' });
  }
  if (!body.number) {
    return res.status(400).json({ error: 'Missing the number' });
  }

  const person = {
    id,
    name: body.name,
    number: body.number,
  };

  const existingName = persons.find((person) => person.name === body.name);
  if (existingName) {
    return res.status(400).json({ error: 'name must be unique' });
  }
  persons = persons.concat(person);
  return res.status(201).json({ ...person });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
