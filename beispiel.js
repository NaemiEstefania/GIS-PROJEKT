/*let element = document.getElementById("title");
element.addEventListener ("click", onclick); // bei click wird es pink , onclick ist der name für die funktion//
function onclick  (event) { 
    element.style.color = ("pink");
}
element.value = "tippen hier ";

 /*let element2 = document.querySelector(".book-form"); 
element2.innerHTML = "<p>hallo</p>" //beides zum hinzufügen //
let newelement = document.createElement("p");
newelement.textContent = "hiii";
element2.append(newelement); */

/*let books = [ {
    title:"It ends with us",
    author:"Colleen Hoover",
    thoughts:"Ist eine Schöne Geschichte...",
    Bewertung: 5, 
    Gelesen: true 
} ]
//console.log(book)//
let details = document.getElementById("book-details");
//details.innerHTML = "<h1>" + book[0].title  + "</h1>" + "<p>" + book[0].author + "</p>" +  "<p> " + book[0].thoughts + "</p>" +"<p>" + book[0].Bewertung + "</p>" + "<p>"  + book.Gelesen + "</p>"; //

for (let book of books) {
    details.innerHTML += "<h1>" + book.title  + "</h1>" + "<p>" + book.author + "</p>" +  "<p> " + book.thoughts + "</p>" +"<p>" + book.Bewertung + "</p>" + "<p>"  + book.Gelesen + "</p>"; // übernehemen aus html book details //
   let h1 = document.createElement("h1");
    h1.textContent =book.title;
    // h1.className = "..."
    let pelement = document.createElement("p");
    pelement.textContent = book.author;

    details.append(h1,pelement);
} */
//let booksJSON = JSON.stringify(books); // speichert  element info > unter lokaler speicher//
//localStorage.setItem("books", booksJSON)//