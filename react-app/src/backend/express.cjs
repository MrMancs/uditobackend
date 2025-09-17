const express = require("express")
const path = require("path")
const app = express()
const port = 3333

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'error.html'))
})

app.listen(port, ()=>{
    console.log("Szerver mükszik ezen a porton:", port)
})