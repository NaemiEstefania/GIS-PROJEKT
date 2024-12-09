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

// Sobald die Seite vollständig geladen ist führt der Browser die Funktion aus, die nach dem => kommt

document.addEventListener('DOMContentLoaded', () => { /* gesamte inhalt von html wird geladen bevor js ausgeführt wird */
    const bookList = document.querySelector('.book-saved');  /* code greift auf verschiedene DOM-Elemente zu und speichert sie in variablen */
    const bookForm = document.querySelector('.book-form');
    const toggleFormButton = document.createElement('button');
    const addButton = document.getElementById('add');
    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const thoughtsInput = document.getElementById('thoughts');
    const coverInput = document.getElementById('cover');
    const ratingInputs = document.querySelectorAll('.stars input[type="radio"]');
    const statusCheckbox = document.getElementById('isRead');

    let isEditing = false;  // variable is editing wird erstellt und auf false gesetzt 
    // wird später verwendet um zu verfolgen ob der benutzer ein buch bearbeitet
    let editingBookIndex = null;  // vorest auf null gesetzt da noch nichts bearbeitet ist 

    // Überschrift für die gespeicherten Bücher hinzufügen
    const booksHeading = document.createElement('h2');
    booksHeading.textContent = 'Gespeicherte Bücher';
    booksHeading.classList.add('books-heading');
    bookList.parentNode.insertBefore(booksHeading, bookList);
   
    
    // Funktion Bücher aus localStorage holen in array gespeichert
    // Diese Methode ruft den Wert ab, der unter dem Schlüssel 'books' im localStorage
    // Konvertiert die gespeicherten JSON-Daten (String) zurück in ein JavaScript-Objekt oder Array
    function getBooksFromLocalStorage() {
        return JSON.parse(localStorage.getItem('books')) || [];
    }

    // Funktion: Bücher in localStorage speichern
    // Wandelt das JavaScript-Array books in einen JSON-String um, da localStorage nur Strings speichern
    function saveToLocalStorage(books) {
        localStorage.setItem('books', JSON.stringify(books));
    }

    // Funktion: Status-Text anzeigen
    function renderStatus(isRead) {
        return isRead ? 'Gelesen' : 'Nicht gelesen';
    }

    // Funktion zur Anzeige der Sterne KI
    function renderStars(rating) {
        const filledStars = '★'.repeat(rating || 0);
        const emptyStars = '☆'.repeat(5 - (rating || 0)); /* berechnet anzahl der leeren sterne die benötigt werden um ins. % sterne zu erreicehn*/
        return filledStars + emptyStars;
    }


    // Funktion: Bücherliste rendern
    function renderBooks() {
        const books = getBooksFromLocalStorage(); // holt bücher aus storage 
        bookList.innerHTML = ''; // Vorhandene Bücherliste leeren

        books.forEach((book, index) => {  // Geht durch jedes Buch im Array 'books', um es im DOM anzuzeigen
            const bookItem = document.createElement('div');
            bookItem.classList.add('book-item');
             // Fügt die HTML-Struktur für ein Buch hinzu, einschließlich der Details und Aktionen
            bookItem.innerHTML = `
                <img src="${book.coverSrc}" alt="Buch-Cover" class="book-icon" />
                <div class="book-details">
                    <p><strong>Titel:</strong> ${book.title}</p>
                    <p><strong>Autor:</strong> ${book.author}</p>
                    <p><strong>Gedanken:</strong> ${book.thoughts}</p>
                    <p><strong>Bewertung:</strong> ${renderStars(book.rating)}</p>
                    <p class="book-status"><strong>Status:</strong> ${renderStatus(book.isRead)}</p>  
                    <button class="action-button edit-button">Bearbeiten</button> 
                    <button class="action-button delete-button">Löschen</button>
                </div>
            `;

            // Event: Buch bearbeiten
            bookItem.querySelector('.edit-button').addEventListener('click', () => {
                const books = getBooksFromLocalStorage();
                const bookToEdit = books[index]; // holt das zu bearbeitende buch 
                // Füllt die Eingabefelder im Formular mit den aktuellen Buchdaten
                titleInput.value = bookToEdit.title;
                authorInput.value = bookToEdit.author;
                thoughtsInput.value = bookToEdit.thoughts;
                
                ratingInputs.forEach((input) => {
                    input.checked = parseInt(input.value) === bookToEdit.rating;
                });

                statusCheckbox.checked = bookToEdit.isRead;

                isEditing = true;
                editingBookIndex = index;
                addButton.textContent = 'Änderungen speichern';
                bookForm.style.display = 'block';
                toggleFormButton.style.display = 'none';
            });

            // Event: Buch löschen
            bookItem.querySelector('.delete-button').addEventListener('click', () => {
                const books = getBooksFromLocalStorage();
                books.splice(index, 1); // Buch aus der Liste entfernen
                saveToLocalStorage(books); // aktualisierte array wird wieder im local storage gespeichert 
                renderBooks(); // Bücherliste aktualisieren
            });

            bookList.appendChild(bookItem);
        });
    }

    // liest die datei aus hinzufügen
    // eventlistener reagiert auf ein bestimmtes eriegnis beippiel click hier
    // Event: Neues Buch hinzufügen oder Änderungen speichern
    addButton.addEventListener('click', () => {
        const title = titleInput.value.trim();
        const author = authorInput.value.trim();
        const thoughts = thoughtsInput.value.trim();
        const coverFile = coverInput.files[0];
        //Initialisiert eine Variable rating mit dem Wert null Dies ist die Bewertung des Buches die später anhand der ausgefüllten Sternewerte ermittelt wird
        let rating = null;
        let isRead = statusCheckbox.checked; // status von checkbox holen
          // Sternbewertung auslesen
        ratingInputs.forEach((input) => {
            if (input.checked) rating = parseInt(input.value);
            // überprift ob radio button ausgewählt wurde wenn ja wird der wert des buttos in eine zahl umgewandelt 

        });
        // falls die felder leer sind  KI, geb warnmeldung aus 
        if (!title || !author) {
            alert('Bitte geben Sie mindestens Titel und Autor ein.');
            return;
        }

        //let coverSrc = 'buchcover-platzhalter.png'; > soll nicht standard sein //
        if (coverFile) {
            coverSrc = URL.createObjectURL(coverFile);
        }

        const newBook = { title, author, thoughts, rating, isRead, coverSrc };
         // Die aktuelle Bücherliste wird aus dem localStorage geladen
        const books = getBooksFromLocalStorage();
        // Bearbeitung eines Buchs KI , falls ein buch bearbeitet wird, werden die informationen des ausgewählten buches aktualisiert ohne inner html 

        if (isEditing) {
            books[editingBookIndex] = newBook; // Vorhandenes Buch aktualisieren durch neue daten erstezt 
            isEditing = false;
            editingBookIndex = null;
            addButton.textContent = 'Hinzufügen';
        } else {
            books.push(newBook); // Das neue Buch wird zur Liste hinzugefügt:
        }

        saveToLocalStorage(books); //Die geänderte Liste wird wieder im localStorage gespeichert
        renderBooks();

        // Formular zurücksetzen
        titleInput.value = '';
        authorInput.value = '';
        thoughtsInput.value = '';
        coverInput.value = '';
        ratingInputs.forEach((input) => (input.checked = false));
        statusCheckbox.checked = false;

        bookForm.style.display = 'none';
        toggleFormButton.style.display = 'block';
    });

    // Event: Suchleiste
    document.querySelector('.search-bar').addEventListener('input', () => {
        const searchText = document.querySelector('.search-bar').value.toLowerCase();
        const bookItems = document.querySelectorAll('.book-item');

        bookItems.forEach((item) => {
            const title = item.querySelector('.book-details p:nth-child(1)').textContent.toLowerCase();
            item.style.display = title.includes(searchText) ? 'flex' : 'none';
        });
    });

    // Button für Formularanzeige
    toggleFormButton.textContent = 'Neues Buch hinzufügen';
    toggleFormButton.classList.add('toggle-form-button');
    bookForm.parentNode.insertBefore(toggleFormButton, bookForm);

    toggleFormButton.addEventListener('click', () => {
        bookForm.style.display = 'block';
        toggleFormButton.style.display = 'none';
        // button nur sichtbar wenn formular nicht angezeigt wird

    });

    // Initiale Bücherliste rendern
    // Die Funktion getBooksFromLocalStorage() wird in renderBooks() aufgerufen um  Liste der gespeicherten Bücher beim Laden der Seite zu erhalten
    renderBooks();
});
