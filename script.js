let element = document.getElementById("title");
element.addEventListener ("click", onclick); /* bei click wird es pink */
function onclick  (event) {
    element.style.color = ("pink");
}
element.value = "tipp here xd";
 /*let element2 = document.querySelector(".book-form"); 
element2.innerHTML = "<p>hallo</p>" /*beides zum hinzufügen 
let newelement = document.createElement("p");
newelement.textContent = "hiii";
element2.append(newelement); */
