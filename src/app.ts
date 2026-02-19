

import express  from "express";

const app = express()
const port = 8080


app.get('/', (req, res)=>{
    res.status(200).json("Main Workshop")
})





app.listen(port, ()=> console.log(`Connected at Port>${port}, Server Express Works`))