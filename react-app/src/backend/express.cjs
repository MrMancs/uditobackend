const express = require("express")
const app = express()
const port = 3333

app.listen(port, ()=>{
    console.log("Szerver mükszik ezen a porton:", port)
})