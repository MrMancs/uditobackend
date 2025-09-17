const express = require("express")
const path = require("path")
const fs = require("fs")
const app = express()
const port = 3333

app.use(express.json())

app.post('/udito/:id', (req, res) => {
    //{"nev":"Sprite","liter":1,"bubis-e":true}
    const newFileLine = `${req.body.nev};${req.body.liter};${req.body["bubis-e"]}`
    try{
        fs.appendFileSync("uditok.txt", newFileLine + "\n")
    } catch(e) {
        res.status(500).json({fileError: e})
    }

    res.status(201).json(req.body)
    
})

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'error.html'))
})

app.listen(port, ()=>{
    console.log("Szerver mükszik ezen a porton:", port)
})