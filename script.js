import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('yes-btn');
const confirmBtn = document.getElementById('confirm-btn');
const btnGroup = document.getElementById('btn-group');
const datePanel = document.getElementById('date-panel');
const mainTitle = document.getElementById('question');

// Funcția care mută butonul într-o poziție complet aleatorie pe ecran
function fugeButonul() {
    // Îi schimbăm poziționarea în fixed ca să poată ieși din containerul lui direct pe tot ecranul
    noBtn.style.position = 'fixed';

    // Calculăm spațiul maxim disponibil pe ecran minus dimensiunea butonului
    const maxX = window.innerWidth - noBtn.offsetWidth;
    const maxY = window.innerHeight - noBtn.offsetHeight;

    // Generăm coordonate la întâmplare
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    // Aplicăm noile coordonate
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
}

// Fuge când pui mouse-ul pe el (PC)
noBtn.addEventListener('mouseover', fugeButonul);

// Fuge și când încerci să îl atingi cu degetul (Telefon)
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Oprește click-ul din greșeală pe mobil
    fugeButonul();
});

// APĂSARE DA
yesBtn.addEventListener('click', () => {
    mainTitle.innerText = "Mă bucur mult ❤️";
    btnGroup.style.display = 'none';
    datePanel.style.display = 'block';

    // În caz că butonul NU era mutat prin ecran, îl ascundem de tot
    noBtn.style.display = 'none';
});

// CONFIRMARE DATĂ
confirmBtn.addEventListener('click', async () => {
    const selectedDate = document.getElementById('calendar').value;

    if (!selectedDate) {
        alert("Te rog alege o dată.");
        return;
    }

    try {
        await addDoc(collection(db, "dates"), {
            selectedDate: selectedDate,
            createdAt: new Date()
        });

        alert("Perfect! Ne vedem pe " + selectedDate + " ❤️");
    } catch (error) {
        console.error(error);
        alert("Eroare la salvare în Firebase.");
    }
});