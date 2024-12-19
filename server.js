const http = require('http');
const mongodb = require('mongodb');

const hostname = '127.0.0.1'; // localhost
const port = 3000;
const url = 'mongodb://127.0.0.1:27017'; // für lokale MongoDB
const mongoClient = new mongodb.MongoClient(url);

async function startServer() {
  await mongoClient.connect(); // Verbindung zur Datenbank herstellen
  server.listen(port, hostname, () => { // Server starten
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}

const server = http.createServer(async (request, response) => {
    response.statusCode = 200;
    response.setHeader('Access-Control-Allow-Origin', '*'); // bei CORS Fehler
    console.log('hi');
    let url = new URL(request.url || '', `http://${request.headers.host}`); 
    console.log(url.pathname);
    console.log(request.method);
    switch (url.pathname) {
      case '/books': {
        const booksCollection = mongoClient.db('bookjournal').collection('books');
        switch (request.method) {
          case 'GET': 
            let result;
              result = await booksCollection.find({}).toArray();
       
            response.setHeader('Content-Type', 'application/json');
            response.write(JSON.stringify(result));
            break;
        } 
      }
    case '/addbook': {
        const booksCollection = mongoClient.db('bookjournal').collection('books');
        switch (request.method) {
            case 'POST': 
                let jsonString = '';
                request.on('data', data => {  // solange daten ankommen, füg die der json string variable hinzu 
                jsonString += data;
                });
                request.on('end', async () => {
               booksCollection.insertOne(JSON.parse(jsonString));
                });
                break;
          } 
        
      }
    
      default:

     response.statusCode = 404; // faslcher pfad gibts nicht 
    }
    response.end();
  } 
);

startServer();