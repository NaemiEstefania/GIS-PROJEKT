const http = require('http'); // backend 
const mongodb = require('mongodb');

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
          response.end('Method Not Allowed');
        }
        break;

      case '/addbook':
        if (request.method === 'POST') {
          let jsonString = '';
          request.on('data', (data) => { // solange daten ankommen, fügt die der json string variable hinzu
            jsonString += data; // sammelt daten des buches 
          });
          request.on('end', async () => {
            await booksCollection.insertOne(JSON.parse(jsonString)); // fügt neues buch ein 
            response.statusCode = 201;
            response.end('Book added successfully');
          });
        } else {
          response.statusCode = 405; // methode nicht erlaubt 
          response.end('Method Not Allowed');
        }
        break;
        
        // ?? const { MongoClient, ObjectId } = require('mongodb'); // Stellen sicher, dass ObjectId korrekt importiert wir

      case '/editbook':
        if (request.method === 'PUT') {
          let jsonString = '';
          request.on('data', (data) => {
            jsonString += data; // json daten sammeln 
          });
          request.on('end', async () => {
            const { _id, ...updatedData } = JSON.parse(jsonString); // id und neue daten extrahieren 
            const result = await booksCollection.updateOne(
              { _id: ObjectId(_id) },// suche nach der id (warum durchgestrichen)
              { $set: updatedData } // aktualisiere die felder 
            );
            response.statusCode = result.modifiedCount > 0 ? 200 : 404; // status abhängig vom Ergebnis 
            response.end(result.modifiedCount > 0 ? 'Book updated successfully' : 'Book not found');
          });
        } else {
          response.statusCode = 405; // methode nicht erlaubt 
          response.end('Method Not Allowed');
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
            const result = await booksCollection.deleteOne({ _id: ObjectId(_id) }); // buch löschen 
            response.statusCode = result.deletedCount > 0 ? 200 : 404;
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
