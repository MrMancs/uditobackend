const express = require("express")
const path = require("path")
const fs = require("fs")
const app = express()
const port = 3333

app.use(express.json())

app.get("/uditok", (req, res) => {
    fs.readFile("uditok.txt", (err, data) => {
        if (err) res.status(404).json({fileError: err})
        else {
            if (data) {
                //OK
                console.log("GET /uditok data", data)

                
                const lines = data.toString().split("\n")
                console.log("lines", lines)

                const responseBodyArr = lines.map(line=> {
                    
                    if(line.length >= 1) {
                        const elements = line.split(";")
                        return {
                            id: +elements[0],
                            nev: elements[1],
                            liter: +elements[2],
                            "bubis-e": elements[3].trim() == 'true'
                        }
                    } else return undefined  
                })
                if (!responseBodyArr[responseBodyArr.length-1]) responseBodyArr.pop()

                console.log("responseBodyArr", responseBodyArr)

                //TODO
                res.status(200).json(responseBodyArr)
            } else res.status(404).json({fileError: data})
        }
    })
})

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