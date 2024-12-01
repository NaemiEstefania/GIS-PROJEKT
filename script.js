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

document.addEventListener('DOMContentLoaded', () => { /* gesamte inhalt von html wird geladen bevor js ausgeführt wird */
    const searchBar = document.querySelector('.search-bar'); /* code greift auf verschiedene DOM-Elemente zu und speichert sie in variablen */
    const addButton = document.getElementById('add');
    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const thoughtsInput = document.getElementById('thoughts');
    const coverInput = document.getElementById('cover');
    const ratingInputs = document.querySelectorAll('.stars input[type="radio"]');
    const bookList = document.querySelector('.book-saved');
    const bookForm = document.querySelector('.book-form');
    const toggleFormButton = document.createElement('button'); /* neuer button um das formular zu togglen (anzeigen/verstecken)*/
    const statusCheckbox = document.createElement('input'); // Neue Checkbox für den Status
    statusCheckbox.type = 'checkbox';

    let isEditing = false;
    let editingBook = null;

    // Button Neues Buch hinzufügen

    toggleFormButton.textContent = 'Neues Buch hinzufügen';
    toggleFormButton.classList.add('toggle-form-button'); /* Button wird zum DOM hinzugefügt */
    bookForm.parentNode.insertBefore(toggleFormButton, bookForm);
    // **NEU: Funktion zur Anzeige des Lesestatus**
    function renderStatus(isRead) { 
        return isRead ? 'Gelesen' : 'Nicht gelesen'; // <-- Status als Text zurückgeben
    }

    // Funktion zur Anzeige der Sterne
    function renderStars(rating) { /* visuelle darstellung der sterne */
        const filledStars = '★'.repeat(rating || 0);
        const emptyStars = '☆'.repeat(5 - (rating || 0));
        return filledStars + emptyStars;
    }

    addButton.addEventListener('click', () => { /* add button fügt neue bücher zur liste hinzu */
        const title = titleInput.value.trim();
        const author = authorInput.value.trim();
        const thoughts = thoughtsInput.value.trim();
        const coverFile = coverInput.files[0];
        let rating = null;
        let isRead = statusCheckbox.checked; // Status von der Checkbox holen


        // Sternbewertung auslesen
        ratingInputs.forEach((input) => {
            if (input.checked) rating = parseInt(input.value);
        });

        if (!title || !author) {
            alert('Bitte geben Sie mindestens Titel und Autor ein.');
            return;
        }

        // Buchcover hochladen oder Platzhalter verwenden falss kein cover hochgeladen wurde 
        let coverSrc = 'buchcover-platzhalter.png';
        if (coverFile) {
            coverSrc = URL.createObjectURL(coverFile);
        }

        // Bearbeitung eines Buchs , falls ein buch bearbeitet wird, werden die informationen des ausgewählten buches aktualisiert
        if (isEditing) {
            editingBook.querySelector('.book-icon').src = coverSrc;
            editingBook.querySelector('.book-details p:nth-child(1)').innerHTML = `<strong>Titel:</strong> ${title}`;
            editingBook.querySelector('.book-details p:nth-child(2)').innerHTML = `<strong>Autor:</strong> ${author}`;
            editingBook.querySelector('.book-details p:nth-child(3)').innerHTML = `<strong>Gedanken:</strong> ${thoughts}`;
            editingBook.querySelector('.book-details p:nth-child(4)').innerHTML = `<strong>Bewertung:</strong> ${renderStars(rating)}`;
            editingBook.querySelector('.book-status').textContent = renderStatus(isRead); // Status aktualisieren

            isEditing = false; // <-- Bearbeitungsmodus zurücksetzen
            editingBook = null; // <-- Bearbeitetes Buch zurücksetzen
            addButton.textContent = 'Hinzufügen';
        } else {
            // Neues Buch hinzufügen
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
                    <p class="book-status">${renderStatus(isRead)}</p>  
                    <button class="edit-button">Bearbeiten</button>
                    <button class="delete-button">Löschen</button>
                </div>
            `;

            // Buch in die Liste einfügen
            bookList.appendChild(bookItem);

            // Event für Bearbeiten
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
                // status auslesen und checkbox NEU
                const statusText = bookDetails.querySelector('.book-status').textContent; // <-- Status holen
                statusCheckbox.checked = statusText === 'Gelesen';

                editingBook = bookItem;
                isEditing = true;
                addButton.textContent = 'Änderungen speichern';
                bookForm.style.display = 'block';
                toggleFormButton.style.display = 'none';
            });

            // delete button für Löschen
            bookItem.querySelector('.delete-button').addEventListener('click', () => {
                bookItem.remove();
            });
        }

        // Eingabefelder zurücksetzen
        titleInput.value = '';
        authorInput.value = '';
        thoughtsInput.value = '';
        coverInput.value = '';
        ratingInputs.forEach((input) => (input.checked = false));
        statusCheckbox.checked = false; // Status zurücksetzen NEU

        // Formular ausblenden
        bookForm.style.display = 'none';
        toggleFormButton.style.display = 'block';
    });

    toggleFormButton.addEventListener('click', () => {
        bookForm.style.display = 'block';
        toggleFormButton.style.display = 'none';
    });

    // Suchfunktion, suchleiste filtert die buchliste basierend auf dem titel
    searchBar.addEventListener('input', () => {
        const searchText = searchBar.value.toLowerCase();
        const bookItems = document.querySelectorAll('.book-item');
        bookItems.forEach((item) => {
            const title = item.querySelector('.book-details p:nth-child(1)').textContent.toLowerCase();
            item.style.display = title.includes(searchText) ? 'flex' : 'none';
        });
    });
});

