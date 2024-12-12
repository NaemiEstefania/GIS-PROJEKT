// MongoDB Modul in Node.js Code verwenden
const mongodb = require('mongodb');

// MongoDB URL und Client für Zugriff anlegen
const mongoUrl = 'mongodb://127.0.0.1:27017'; // für lokale MongoDB , standard url , oben in suchleiste eingeben 
const mongoClient = new mongodb.MongoClient(mongoUrl);

async function main() {
  // Mit MongoDB verbinden
  await mongoClient.connect(); // warten bis verbindung zur datenbank da ist 

  // Auf university Datenbank -> student Collection zugreifen
  const db = mongoClient.db("university");
  const studentCollection = db.collection("student");

  // Datensatz (Student) einfügen
  const newStudent = {
    studentNr: 333333,
    firstName: "Max",
    lastName: "Mustermann",
    semester: 1,
    faculty: "DM",
    course: "OMB",
  };
  await studentCollection.insertOne(newStudent); // füg studenten ein

  // Datensatz suchen
  const student = await studentCollection.findOne({ studentNr: 333333 });
  console.log(student);

  // Verbindung zu MongoDB beenden
  await mongoClient.close();
}

main();