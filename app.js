const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const PORT = 5000;

const app = express();

// Read the JSON data from the file
const jsonData = fs.readFileSync(path.join(__dirname, "/database.json"), 'utf-8');
const data = JSON.parse(jsonData);

app.set('view engine', 'ejs');

// Search function: allows searching by name and tags
function search(name, tags) {
    let results = [];

    // Normalize the input
    const lowerName = name ? name.toLowerCase() : null;
    const lowerTags = tags ? tags.map(tag => tag.toLowerCase()) : [];

    // Iterate through the books to search for matching names and tags
    data.forEach(book => {
        const bookName = book["name"].toLowerCase();
        const bookTags = book["tags"].map(tag => tag.toLowerCase());

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

function updateDatabase(res) {
    fs.writeFile(path.join(__dirname, "database.json"), JSON.stringify(data, null, 2), (err) => {
        if (err) {
            return {result: false, status: err}
            
        }
        return {result: true, status: "completed successfully"};
    });
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

app.get("/js/create.js", (req, res) => {
    res.sendFile(path.join(__dirname, "js", "create.js"));
});

app.get("/css/styles.css", (req, res) => {
    res.sendFile(path.join(__dirname, "css", "styles.css"))
})

// POST /search route to handle search requests
app.post("/search", (req, res) => {
    const { name, tags } = req.body;  // Extract name and tags from request body
    const result = search(name, tags); // Call the search function

    res.send({ status: true, message: "done successfully", result: result });
});

app.get("/create-book", (req, res) => {
    res.sendFile(path.join(__dirname, "html", "create.html"))
})


app.post("/create", (req, res) => {
    console.log(req.body)
    data.push(req.body)
    const err = updateDatabase()
    if (err) {
        res.send({status: false, message: err})
    }else{
        res.send({status: true, message: "done"})
    }
    
});

app.get('/view', (req, res) => {
    const id = req.query.id;  // Use req.query instead of req.body for GET requests

    const book = data[id];  // Retrieve the book using the id from the query string
    if (book) {
        res.render('view', { book });  // Pass the book object to the EJS view
    } else {
        res.status(404).send('Book not found');
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
