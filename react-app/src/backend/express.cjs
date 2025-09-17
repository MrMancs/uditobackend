const express = require("express")
const path = require("path")
const fs = require("fs")
const app = express()
const port = 3333

app.use(express.json())

app.post('/udito/:id', (req, res) => {
    //{"nev":"Sprite","liter":1,"bubis-e":true}

    //TODO - if id exists?

    //if id doesn't exist yet:
    const id = +req.params.id

    const newFileLine = `${id};${req.body.nev};${req.body.liter};${req.body["bubis-e"]}`
    try{
        fs.appendFileSync("uditok.txt", newFileLine + "\n")
    } catch(e) {
        res.status(500).json({fileError: e})
    }

    const responseBody = {id, ...req.body}

    res.status(201).json(responseBody)
    
})

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'error.html'))
})

app.listen(port, ()=>{
    console.log("Szerver mükszik ezen a porton:", port)
})