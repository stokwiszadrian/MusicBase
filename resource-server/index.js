const express = require('express')
const app = express()
const cors = require('cors')

const corsOptions = {
  origin: 'http://localhost:4000/',
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
})

app.use(express.json())
const Albums = require('./models/Albums')
const Keycloak = require('keycloak-connect');
const session = require('express-session');

const memoryStore = new session.MemoryStore();

app.use(session({
  secret: 'some secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));


const keycloak = new Keycloak({
  store: memoryStore
});

app.use(keycloak.middleware({
  logout: '/logout',
  admin: '/'
}));


app.get("/api", async (req, res) => {
  res.send("Hello from API!")
})

app.post("/api", async (req, res) => {
  const reversed = [...req.body.text].reverse().join("")
  res.send({
    reversed: reversed
  })
})

app.get("/api/albums", keycloak.protect(), async (req, res) => {
  const result = await Albums.find({})
  res.send({
    albums: result
  })
})

app.get("/api/album/:id", keycloak.protect(), async (req, res) => {
  const result = await Albums.findById(req.params.id)
  res.send({
    album: result
  })
})

app.get("/api/album/bytitle/:title", keycloak.protect(), async (req, res) => {
  const result = await Albums.find({ title: req.params.title })
  res.send({
    album: result[0]
  })
})

app.get("/api/recentalbums", keycloak.protect(), async (req, res) => {
  const result = await Albums.find({}).limit(5)
  res.send({
    albums: result
  })
})

app.post("/api/albums/add", keycloak.protect(), async (req, res) => {
  const author = req.body.author
  const title = req.body.title
  const songs = req.body.songs || []
  const year = req.body.year
  const insert = Albums.init()
    .then(async () => {
      await Albums.create({
        author: author,
        title: title,
        songs: songs,
        year: year
      })
    })
    .catch(err => {
      console.log(err)
    })
  
  res.send("OK")
})


app.put("/api/albums/edit/:id", keycloak.protect(), async ( req, res ) => {
  const author = req.body.author
  const title = req.body.title
  const songs = req.body.songs
  const year = req.body.year
  const update = await Albums.findById(req.params.id)
  update.author = author
  update.title = title
  update.songs = songs
  update.year = year
  await update.save()
  res.send("OK")
})

app.delete("/api/albums/delete/:id", keycloak.protect(), async (req, res) => {
  const del = await Albums.findOneAndDelete({ _id: req.params.id})
  res.send({
    deleted: del
  })
})

require('dotenv').config();
const dbConnData = {
    host: process.env.MONGO_HOST || 'localhost',
    port: process.env.MONGO_PORT || '27017',
    database: process.env.MONGO_DATABASE || 'local'
};

const mongoose = require('mongoose');

  mongoose
  .connect(`mongodb://${dbConnData.host}:${dbConnData.port}/${dbConnData.database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(response => {
    console.log(`Connected to MongoDB. Database name: "${response.connections[0].name}"`)
    const port =  process.env.PORT || 5000
    app.listen(port, () => {
      console.log(`API server listening at http://localhost:${port} NEW BUILD`);
    });
  })
  .catch(error => console.error('Error connecting to MongoDB', error));