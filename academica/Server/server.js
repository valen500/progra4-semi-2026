var express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    io = require('socket.io')(http),
    {MongoClient, ObjectId} = require('mongodb'),
    url = 'mongodb://localhost:27017',
    client = new MongoClient(url),
    dbname = 'chats_ugb',
    port = 3000;

const crypto = require('crypto');
global.crypto = crypto.webcrypto;

app.use(express.json()); //para que pueda leer json
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.post('/api/alumnos', async (req, res) => {
    let data = req.body,
    db = await conectarMongo(),
    collection = db.collection('alumnos'),
    result = await collection.insertOne(data);
    res.send({msg:result});
});
app.put('/api/alumnos', async (req, res) => {
    let data = req.body,
    db = await conectarMongo(),
    collection = db.collection('alumnos'),
    result = await collection.updateOne({_id:new ObjectId(data.idalumno)},{$set:data});
    res.send({msg:result});
});
app.delete('/api/alumnos/:idalumno', async (req, res) => {
    let idalumno = req.params.idalumno,
    db = await conectarMongo(),
    collection = db.collection('alumnos'),
    result = await collection.deleteOne({_id:new ObjectId(idalumno)});
    res.send({msg:result});
});
app.get('/api/alumnos', async (req, res) => {
    let buscar = req.query.buscar,
        db = await conectarMongo(),
        collection = db.collection('alumnos'),
        result = await collection.find({
            $or:[   
                {codigo:{$regex:buscar,$options:'i'}},
                {nombre:{$regex:buscar,$options:'i'}}
            ]
        }).toArray();
    res.send(result);
});

async function conectarMongo(){
    await client.connect();
    return client.db(dbname);
}

io.on('connect', (socket) => {
    console.log('Un usuario se ha conectado');

    socket.on('mensajeRecibido', async (data) => {
        let db = await conectarMongo(),
            collection = db.collection('chats'),
            result = collection.insertOne({user:data.titulo, mensaje:data.mensaje, fecha:new Date()});
        io.emit('mensajeEnviar', data);
    })
});

http.listen(port, () => {
    console.log('Escuchando en el puerto ', port);
});