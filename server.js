// server.js

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Load words from file
let words = [];

try {
    const data = fs.readFileSync('words.json', 'utf8');
    words = JSON.parse(data);
} catch (err) {
    console.error("Error reading file:", err);
}

// Save words to file
function saveWords() {
    fs.writeFileSync('words.json', JSON.stringify(words), 'utf8');
}

// Endpoint to get the list of words
app.get('/words', (req, res) => {
    res.json(words);
});

// Endpoint to add a new word
app.post('/words', (req, res) => {
    const newWord = req.body.word.trim().toLowerCase();
    if (newWord !== '' && !words.includes(newWord)) {
        words.push(newWord);
        saveWords();
        res.status(201).send('Word added successfully.');
    } else {
        res.status(400).send('Invalid word or word already exists.');
    }
});

// Endpoint to delete a word
app.delete('/words/:word', (req, res) => {
    const wordToDelete = req.params.word.trim().toLowerCase();
    const index = words.indexOf(wordToDelete);
    if (index !== -1) {
        words.splice(index, 1);
        saveWords();
        res.send('Word deleted successfully.');
    } else {
        res.status(404).send('Word not found.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
