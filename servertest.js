const http = require('http');

const hostname = '127.0.0.1'; // localhost
const port = 3000;
 // funktion geht rein mt diesen beiden parametern 
const server = http.createServer((request, response) => {
  response.statusCode = 200;
  response.setHeader('Content-Type', 'text/plain'); // plain text soll zurückgeschcikt werden, bei json daten application/json
  response.setHeader('Access-Control-Allow-Origin', '*'); // bei CORS Fehler */ immer wenn man live server benutzt annmachen
  /*response.setHeader("Access-Control-Allow-Methods", "*"); // Erlaubt alle HTTP-Methoden */
  /*response.setHeader("Access-Control-Allow-Headers", "*"); // Erlaubt das Empfangen von Requests mit Headern, z. B. Content-Type */
  response.end('Hello World'); // abschliessen mit response end 
});
// server horcht auf url und sobald eine anfrage reinkommt führt er code aus 
server.listen(port, hostname, () => {
  console.log(`Server läuft unter http://${hostname}:${port}/`);
});