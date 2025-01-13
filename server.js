const http = require('http'); // backend 
const mongodb = require('mongodb');
const {ObjectId } = mongodb;

const hostname = '127.0.0.1'; // localhost
const port = 3000;
const url = 'mongodb://127.0.0.1:27017'; // für lokale MongoDB
const mongoClient = new mongodb.MongoClient(url);


async function startServer() {
  await mongoClient.connect(); // verbindung zur datenbank herstellen
  server.listen(port, hostname, () => { // server starten 
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}

function getBooksCollection() {
  return mongoClient.db('bookjournal').collection('books'); // verbindet mit datenbank book journal und greift auf sammlung books zu 
}

const server = http.createServer(async (request, response) => { // node.js server wird erstellt reagiert auf anfragen und gubt antworten zurück
  response.setHeader('Access-Control-Allow-Origin', '*'); // header lösen cors probleme, die auftreten können wenn ein browser anfragen an server sendet 
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // erlaubt spezifusche methoden
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // erlaubt header 



  if (request.method === 'OPTIONS') { // Beantwortet sogenannte Preflight-Anfragen, die von Browsern geschickt werden
    response.statusCode = 204;
    response.end();
    return;
  }

  const url = new URL(request.url || '', `http://${request.headers.host}`); // Analysiert die Anfrage-URL, um auf den Pfad und Parameter zuzugreifen
  const booksCollection = getBooksCollection();


  try {
    switch (url.pathname) { // Verarbeitet die verschiedenen Endpunkte basierend auf dem Pfad in der Anfrage
      case '/books':
        if (request.method === 'GET') {
          const books = await booksCollection.find({}).toArray(); // ruft alle bücher ab
          response.statusCode = 200;
          response.setHeader('Content-Type', 'application/json'); // antwortyp json
          response.end(JSON.stringify(books));
        } else {
          response.statusCode = 405; // methode nicht erlaubt
          response.setHeader('Content-Type', 'application/json'); // Sicherstellen, dass der Content-Type gesetzt ist
          response.end('Method Not Allowed');
        }
        break;

        case '/addbook': {
          const booksCollection = mongoClient.db('bookjournal').collection('books');
          switch (request.method) {
              case 'POST': 
                  let jsonString = '';
                  request.on('data', data => {  // solange daten ankommen, füg die der json string variable hinzu 
                  jsonString += data;
                  });
                  request.on('end', async () => {
                 await booksCollection.insertOne(JSON.parse(jsonString));
                 response.statusCode = 201;
                 response.setHeader('Content-Type', 'application/json'); // Content-Type für JSON setzen
                 response.end(JSON.stringify({ message: 'Book added successfully' }));

                  });
                  break;
            } 
          
        }
        
        // ?? const { MongoClient, ObjectId } = require('mongodb'); // Stellen sicher, dass ObjectId korrekt importiert wir

        case '/editbook':
          if (request.method === 'PUT') { // PUT zum Aktualisieren eines Buches
            let jsonString = '';
            request.on('data', (data) => {
              jsonString += data; // json daten sammeln 
            });
            request.on('end', async () => {
              const { _id, ...updatedData } = JSON.parse(jsonString); // Extrahiere die ID und die neuen Daten
              const result = await booksCollection.updateOneOne(
                { _id: ObjectId(_id) }, // Suche nach der ID des Buches
                { $set: updatedData } // Setze die neuen Daten
              );
              response.statusCode = result.modifiedCount > 0 ? 200 : 404; // Wenn erfolgreich, sende 200, sonst 404
              response.setHeader('Content-Type', 'application/json'); // Setze den Content-Type
              response.end(result.modifiedCount > 0
                ? JSON.stringify({ message: 'Book updated successfully' })
                : JSON.stringify({ message: 'Book not found' }));
            });
          } else {
            // Wenn die Methode nicht PUT ist, antworten wir mit 405 (Method Not Allowed)
        response.statusCode = 405;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify({ message: 'Method Not Allowed' }));
      }
      break;

      case '/deletebook':
        if (request.method === 'DELETE') {
          let jsonString = '';
          request.on('data', (data) => {
            jsonString += data; // json daten sammeln 
          });
          request.on('end', async () => {
            const { _id } = JSON.parse(jsonString); // id extrahieren 
            const result = await booksCollection.deleteOne({ _id: ObjectId(_id) }); // buch löschen geht nur mit new davor   
            response.statusCode = result.deletedCount > 0 ? 200 : 404;
            response.setHeader('Content-Type', 'application/json');
            response.end(result.deletedCount > 0 ? 'Book deleted successfully' : 'Book not found');
          });
        } else {
          response.statusCode = 405;
          response.end('Method Not Allowed');
        }
        break;

      default: // gibt fehler zurück wenn endpunkt nicht erkannt wird 
        response.statusCode = 404; // unbekannter endpunkt 
        response.end('Endpoint not found');
    }
  } catch (err) { // try catch um fehler abzufangen 
    console.error(err);
    response.statusCode = 500;
    response.end('Server error');
  }
});

startServer();
