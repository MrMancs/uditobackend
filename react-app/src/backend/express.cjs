const express = require("express")
const path = require("path")
const fs = require("fs")
const app = express()
const port = 3333

app.use(express.json)

const uditoDataRead = function(data) {
    //OK
    console.log("GET data", data)

    
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

    return responseBodyArr

    //TODO
    res.status(200).json(responseBodyArr)
}   

app.get("/uditok", (req, res) => {
    fs.readFile("uditok.txt", (err, data) => {
        if (err) res.status(404).json({fileError: err})
        else {
            if (data) {
                const responseBodyArr = uditoDataRead(data)

                res.status(200).json(responseBodyArr)
            } else res.status(404).json({fileError: data})
        }
    })
})

app.get("/udito/:id", (req, res) => {
    fs.readFile("uditok.txt", (err, data) => {
        if (err) res.status(404).json({fileError: err})
        else {
            if (data) {
                const responseBodyArr = uditoDataRead(data)
                const id = +req.params.id

                res.status(200).json(responseBodyArr[id-1])
            } else res.status(404).json({fileError: data})
        }
    })
})

app.post('/udito/:id', (req, res) => {
    //{"nev":"Sprite","liter":1,"bubis-e":true}

    //TODO - if id exists?
    fs.readFile("uditok.txt", (err, data) => {
        if (err) res.status(404).json({fileError: err})
        else {
            if (data) {
                const responseBodyArr = uditoDataRead(data)
                
                const id = +req.params.id

                const found = responseBodyArr.find(udito => +udito.id == +id)

                if (responseBodyArr.contains(found)) res.status(300).json({error: "existing id conflict"})

                res.status(300).json({error: "existing id conflict"})

            } //else res.status(404).json({fileError: data}) 
        }
    })

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

app.patch("/udito/:id", (req, res) => {
    const data = fs.readFileSync("uditok.txt")
    const responseBodyArr = this.uditoDataRead(data)
    console.log("responseBodyArr", responseBodyArr)
    console.log("params", req.params)
    const id = +req.params.id
    console.log("id", id)

    const foundIndex = responseBodyArr.findIndex(udito => +udito.id == +id)
    console.log("foundIndex", foundIndex)
    if (foundIndex < 0) res.status(400).json({error: "id not found"})
    else {
        console.log("req.body", req.body)
        const responseBody = {id, ...req.body}
        console.log("responsebody", responseBody)

        responseBodyArr.splice(foundIndex, 1, responseBody)
        console.log("responsebodyarr after splice", responseBodyArr)

        /*
        const newFileLine = `${id};${req.body.nev};${req.body.liter};${req.body["bubis-e"]}`
        try{
            fs.appendFileSync("uditok.txt", newFileLine + "\n")
        } catch(e) {
            res.status(500).json({fileError: e})
        }
        */

        let fileLines = ""
        responseBodyArr.forEach(udito => {
            const newFileLine = `${udito.id};${udito.nev};${udito.liter};${udito["bubis-e"]}\n`
            fileLines += newFileLine
        });

        fs.writeFileSync("uditok.txt", fileLines)
    }

    res.sendStatus(200)
})

app.delete("/udito/:id", (req, res) => {
    fs.readFile("uditok.txt", (err, data) => {
        if (err) res.status(404).json({fileError: err})
        else {
            if (data) {
                const responseBodyArr = uditoDataRead(data)
                
                console.log("params", req.params)
                const id = +req.params?.id

                const foundIndex = responseBodyArr.findIndex(udito => +udito.id == +id)

                if (responseBodyArr.contains(found)) res.status(300).json({error: "existing id conflict"})

                //res.status(200).json({error: "existing id conflict"})

            } //else res.status(404).json({fileError: data}) 
        }
    })

    //if id doesn't exist yet:
    const id = +req.params?.id

    const delFileLine = `${id};${req.body.nev};${req.body.liter};${req.body["bubis-e"]}`
    try{
        // TODO - delete id line!
        console.log('id, data', id, data)
        fs.writeFileSync("udito.txt", data)
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