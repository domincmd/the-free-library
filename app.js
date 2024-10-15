const express = require("express")
const bodyParser = require('body-parser')
const path = require('path')
const PORT = 5000


const app = express()

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "html", "index.html"))
})


app.post("/search", (req, res) => {
    console.log(req.body)
    res.send("recieved")
})

app.listen(PORT, () => {
    console.log(PORT)
})