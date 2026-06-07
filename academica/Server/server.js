var http = require('http').Server(),
    io = require('socket.io')(http),
    {MongoClient, ObjectId} = require('mongodb'),
    url = 'mongodb://localhost:27017',
    client = new MongoClient(url),
    dbname = 'chats_ugb';

const crypto = require('crypto');
global.crypto = crypto.webcrypto;

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

http.listen(3000, () => {
    console.log('Escuchando en el puerto 3000');
});