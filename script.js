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
    const searchBar = document.querySelector('.search-bar'); 
    // query selector sucht nach dem ersten element der klasse .searchbar
    /* code greift auf verschiedene DOM-Elemente zu und speichert sie in variablen */
    const addButton = document.getElementById('add');
    // const bedeutet dass wir variable names searchbar erstellen 
    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const thoughtsInput = document.getElementById('thoughts');
    const coverInput = document.getElementById('cover');
    const ratingInputs = document.querySelectorAll('.stars input[type="radio"]');
    const bookList = document.querySelector('.book-saved');
    const bookForm = document.querySelector('.book-form');
    const toggleFormButton = document.createElement('button'); /* neuer button um das formular zu togglen (anzeigen/verstecken)*/
    const statusCheckbox = document.getElementById('isRead'); // Neue Checkbox für den Status
    statusCheckbox.type = 'checkbox';
    // stellt sicher dass das element status checkbox vom typ checkbox ist

    let isEditing = false;
    // variable is editing wird erstellt und auf false gesetzt 
    // wird später verwendet um zu verfolgen ob der benutzer ein buch bearbeitet
    let editingBook = null; 
    // vorest auf null gesetzt da noch nichts bearbeitet ist 
    // variable speichert aktuall bearbeitetes buch 
   // lokaler speicher für Bücher zeigt nicht an ? versucht, ein Buch aus dem lokalen Speicher des Browsers zu holen.
    let bookItem = JSON.parse(localStorage.getItem("bookItem")) || [];
    
    // Button Neues Buch hinzufügen
     
    toggleFormButton.textContent = 'Neues Buch hinzufügen';
    toggleFormButton.classList.add('toggle-form-button');  // css klasse  Button 
    bookForm.parentNode.insertBefore(toggleFormButton, bookForm); // fügt den button in das DOM
    //  Funktion zur Anzeige des Lesestatus parameter is readd
    function renderStatus(isRead) { 
        // ternäre bindung die überprüft ob isread wahr oder falsch ist KI
        return isRead ? 'Gelesen' : 'Nicht gelesen'; // <-- Status als Text zurückgeben
    }

    // Funktion zur Anzeige der Sterne KI
    function renderStars(rating) { /* visuelle darstellung der sterne */
        const filledStars = '★'.repeat(rating || 0); /* falls rating null ist werden o sterne angeziegt*/
        const emptyStars = '☆'.repeat(5 - (rating || 0)); /* berechnet anzahl der leeren sterne die benötigt werden um ins. % sterne zu erreicehn*/
        return filledStars + emptyStars;
    }

     // liest die datei aus hinzufügen
    addButton.addEventListener('click', () => { /* add button fügt neue bücher zur liste hinzu */
        const title = titleInput.value.trim();
        const author = authorInput.value.trim();
        const thoughts = thoughtsInput.value.trim();
        const coverFile = coverInput.files[0];
        //Initialisiert eine Variable rating mit dem Wert null Dies ist die Bewertung des Buches die später anhand der ausgefüllten Sternewerte ermittelt wird
        let rating = null;
        let isRead = statusCheckbox.checked; // Status von der Checkbox holen


        // Sternbewertung auslesen
        ratingInputs.forEach((input) => {
            if (input.checked) rating = parseInt(input.value); // überprift ob radio button ausgewählt wurde wenn ja wird der wert des buttos in eine zahl umgewandelt 
        });
        // falls die felder leer sind  KI, geb warnmeldung aus 
        if (!title || !author) {
            alert('Bitte geben Sie mindestens Titel und Autor ein.');
            return;
        }

        // Buchcover hochladen oder Platzhalter verwenden falss kein cover hochgeladen wurde 
        let coverSrc = 'buchcover-platzhalter.png';
        if (coverFile) {
            coverSrc = URL.createObjectURL(coverFile);
        }

        // Bearbeitung eines Buchs KI , falls ein buch bearbeitet wird, werden die informationen des ausgewählten buches aktualisiert ohne inner html 
        if (isEditing) { /* überprift of wir gerande Bearbeiten*/
            const bookIcon = editingBook.querySelector('.book-icon');
            bookIcon.src = coverSrc; /* ändert eigenschaft auf neues cover*/

            const details = editingBook.querySelector('.book-details');

            const titleElement = details.querySelector('p:nth-child(1)'); /* sucht das erste p tag und speichert es in der variablen ritle emelemnt*/
            titleElement.textContent = ''; /* löscht aktuellen inhalt*/
            const titleStrong = document.createElement('strong')
            titleStrong.textContent = 'Titel:';
            titleElement.append(titleStrong, ` ${title}`);

            const authorElement = details.querySelector('p:nth-child(2)');
            authorElement.textContent = '';
            const authorStrong = document.createElement('strong');
            authorStrong.textContent = 'Autor:';
            authorElement.append(authorStrong, ` ${author}`);

            const thoughtsElement = details.querySelector('p:nth-child(3)');
            thoughtsElement.textContent = '';
            const thoughtsStrong = document.createElement('strong');
            thoughtsStrong.textContent = 'Gedanken:';
            thoughtsElement.append(thoughtsStrong, ` ${thoughts}`);

            const ratingElement = details.querySelector('p:nth-child(4)');
            ratingElement.textContent = '';
            const ratingStrong = document.createElement('strong');
            ratingStrong.textContent = 'Bewertung:';
            ratingElement.append(ratingStrong, ` ${renderStars(rating)}`);

            const statusElement = editingBook.querySelector('.book-status');

            // Inhalt leeren, um neu zu strukturieren
            statusElement.textContent = '';   
            const statusStrong = document.createElement('strong');
            statusStrong.textContent = 'Status:' ;
            statusElement.appendChild(statusStrong);
            statusElement.append(` ${renderStatus(isRead)}`);
            isEditing = false;
            editingBook = null;
            addButton.textContent = 'Hinzufügen';

        } else {
            // Neues Buch hinzufügen falss wir nicht bearbeiten
            // erstellt neues div element 
            const bookItem = document.createElement('div');
            bookItem.classList.add('book-item');
            //`Backticks (``) sind notwendig, wenn du Variablen oder komplexere Inhalte in einen String einbetten möchtest
            bookItem.innerHTML = ` 
        
                <img src="${coverSrc}" alt="Buch-Cover" class="book-icon" />
                <div class="book-details">
                    <p><strong>Titel:</strong> ${title}</p>
                    <p><strong>Autor:</strong> ${author}</p>
                    <p><strong>Gedanken:</strong> ${thoughts}</p>
                    <p><strong>Bewertung:</strong> ${renderStars(rating)}</p>
                    <p class="book-status"><strong>Status:</strong> ${renderStatus(isRead)}</p>  
                    <button class="action-button edit-button">Bearbeiten</button> 
                    <button class="action-button delete-button">Löschen</button>
                   
                </div>
            `;

            // Buch in die Liste einfügen
            bookList.appendChild(bookItem);

            // Event für Bearbeiten alles wird eben wieder in die felder eingefügt
            bookItem.querySelector('.edit-button').addEventListener('click', () => {
                const bookDetails = bookItem.querySelector('.book-details');
                titleInput.value = bookDetails.querySelector('p:nth-child(1)').textContent.replace('Titel: ', '');
                authorInput.value = bookDetails.querySelector('p:nth-child(2)').textContent.replace('Autor: ', '');
                thoughtsInput.value = bookDetails.querySelector('p:nth-child(3)').textContent.replace('Gedanken: ', '');
                const stars = bookDetails.querySelector('p:nth-child(4)').textContent.replace('Bewertung: ', '');
                const selectedRating = stars.split('★').length - 1;
                ratingInputs.forEach((input) => {
                    input.checked = parseInt(input.value) === selectedRating;
                });
                // status auslesen und checkbox 
                const statusText = bookDetails.querySelector('.book-status').textContent; // <-- Status holen
                statusCheckbox.checked = statusText === 'Gelesen';
                // stezt editing book variabke auf gerade bearbeites book item
                editingBook = bookItem;
                isEditing = true;
                // befinden und im bearbeitungsmodus 
                // ändert text 
                addButton.textContent = 'Änderungen speichern';
                bookForm.style.display = 'block';
                toggleFormButton.style.display = 'none';
                // blendet toogle form button aus weil wir bearbeiten
            });

            // delete button für Löschen
            bookItem.querySelector('.delete-button').addEventListener('click', () => {
                bookItem.remove();
                // entfernt book titem aus dem dom , wird nicht mehr angezeigt
            });
        }

        // Eingabefelder zurücksetzen
        // leert die werte , passiert nach dem hinzufügen oder bearbeiten
        titleInput.value = '';
        authorInput.value = '';
        thoughtsInput.value = '';
        coverInput.value = '';
        ratingInputs.forEach((input) => (input.checked = false));
        statusCheckbox.checked = false; // Status zurücksetzen 

        // Formular ausblenden macht button sichtbar
        bookForm.style.display = 'none';
        toggleFormButton.style.display = 'block';
    });
    // Wenn der Benutzer auf den Button klickt, wird das Formular angezeigt oder ausgeblendet.
    toggleFormButton.addEventListener('click', () => {
        bookForm.style.display = 'block';
        toggleFormButton.style.display = 'none';
        // button nur sichtbar wenn formular nicht angezeigt wird
    });

    // Suchfunktion, suchleiste filtert die buchliste basierend auf dem titel
    searchBar.addEventListener('input', () => {
        const searchText = searchBar.value.toLowerCase();
        // speichert text den der benutzer einegeben kann
        const bookItems = document.querySelectorAll('.book-item');
        // sammelt book item elemenze 
        bookItems.forEach((item) => {
            // geht jedes buch durch 
            const title = item.querySelector('.book-details p:nth-child(1)').textContent.toLowerCase();
            //holst sich den titel des buches der im ersten p tag innerhalb book details im container steht
            item.style.display = title.includes(searchText) ? 'flex' : 'none';
            // Wenn der Titel des Buches den Suchbegriff (searchText) enthält, wird das Buch (item) angezeigt (mit display: flex). Andernfalls wird es ausgeblendet (display: none).
        });
    });
}); 


