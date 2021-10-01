const connectMongo = require('./db');
const express = require('express')
var cors = require('cors')


connectMongo();
const app = express()
const port = process.env.PORT;

app.use(cors())

app.use(express.json())

//available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

if(process.env.NODE_ENV==="production"){
  app.use(express.static("../build"))
  const path = require("path")
}

app.listen(port, () => {
  console.log(`my_notebook backend listening at http://localhost:${port}`)
})