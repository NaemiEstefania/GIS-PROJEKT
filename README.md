# Bücherjournal

Interaktive Bücherliste mit Bewertung:

Webanwendung: 
ermöglicht es Bücher zu verwalten und zu bewerten (mit Sternen), als auch den Lesestatus festzulegen (ungelesen, gelesen).
Funktionen: 
Eingabe vom Buchtitel, Autor und Bewertung (Sterne 1-5), Markierung der Bücher als ungelesen oder gelesen, Suchleiste ermöglicht das Durchsuchen der Liste nach Titel oder Autor, Feld mit sonstigen Gedanken zum Buch, Eine klare Navigationsleiste mit Links zu „Alle Bücher“, „Ungelesen“ und „Gelesen“.
Wie und Wo werden die eingegebenen Informationen eingegeben oder erstellt?
Interaktive Elemente wie Textfelder, Sternenbewertungs-Systeme, Checkboxen und Sonstiges 
Wie und Wo sollen Informationen bearbeitet oder gelöscht werden?
Jedes Buch hat eine Bearbeiten-Schaltfläche, mit dem der Benutzer Änderungen vornehmen kann und nach der Bearbeitung klickt der Benutzer auf Speichern.
Außerdem gibt es eine Löschen-Schaltfläche neben jedem Buch und eine Schaltfläche mit "Buch hinzufügen"
Wie und Wo werden die Informationen angezeigt?
In einer dynamischen Liste oder Grid-Layout (evtl. auch Gruppierungen nach Genre), die Liste zeigt alle Details zu den Büchern (Titel, Autor, Bewertung mit Sternen, Lesestatus, Sonstiges).

Beispielbuch teil html vor local storage 

 <div class="book-item">
         <!-- Hier wird das Bild hinzugefügt, sterne aus unicode tabelle -->
         <img src="buchcover-platzhalter.png" alt=" Buch-Cover" class="book-icon" />
         <div class ="book-details" id="book-details"> 
        <p></p><strong>Titel:</strong> It ends with us</br> <!-- verschiedene texabsätze mit p strong für fettgeduckt-->
        <p><strong>Autor:</strong> Colleen Hoover</br>
        <p><strong>Gedanken:</strong> Schöne Geschichte...</br>
        <p><strong>Bewertung:</strong> ★★★★☆</br> <!-- zeichen sterne von KI-->
        <p><strong>Status:</strong> Gelesen<br>
        <button class="edit-button" >Bearbeiten</button>
        <button class="delete-button" >Löschen</button> 
         </div>