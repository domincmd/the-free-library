const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const PORT = 5000;

const app = express();

// Read the JSON data from the file
const jsonData = fs.readFileSync(path.join(__dirname, "/database.json"), 'utf-8');
const data = JSON.parse(jsonData);

// Search function: allows searching by name and tags
function search(name, tags) {
    let results = [];

    // Normalize the input
    const lowerName = name ? name.toLowerCase() : null;
    const lowerTags = tags ? tags.map(tag => tag.toLowerCase()) : [];

    // Iterate through the books to search for matching names and tags
    data.forEach(book => {
        const bookName = book.name.toLowerCase();
        const bookTags = book.tags.map(tag => tag.toLowerCase());

        // Match by name if name is provided and matches part of the book name
        const nameMatch = lowerName ? bookName.includes(lowerName) : true;

        // Match by tags if tags are provided and at least one tag matches
        const tagMatch = lowerTags.length > 0 ? lowerTags.some(tag => bookTags.includes(tag)) : true;

        // If both name and tags match, add to results
        if (nameMatch || tagMatch) {
            results.push(book);
        }
    });

    return results;
}

// Middleware to parse JSON request bodies
app.use(bodyParser.json()); // Parse application/json

// Middleware to parse URL-encoded form bodies (optional if you're using forms)
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "html", "index.html"));
});

// Return the JS files, now contained in the backend!
app.get("/js/search.js", (req, res) => {
    res.sendFile(path.join(__dirname, "js", "search.js"));
});
app.get("/js/view.js", (req, res) => {
    res.sendFile(path.join(__dirname, "js", "view.js"));
});

// POST /search route to handle search requests
app.post("/search", (req, res) => {
    const { name, tags } = req.body;  // Extract name and tags from request body
    const result = search(name, tags); // Call the search function

    res.send({ status: true, message: "done successfully", result: result });
});

app.post("/view", (req, res) => {
    const id = req.body.id

    console.log(id)
    const book = data[id]
    res.sendFile({book: book})
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
