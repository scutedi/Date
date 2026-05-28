import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import flatpickr from "https://esm.sh/flatpickr";
import { Romanian } from "https://esm.sh/flatpickr/dist/l10n/ro.js";

const stars = document.querySelectorAll('.star');
const nextBtn = document.getElementById('next-btn');
const stepRating = document.getElementById('step-rating');
const stepQuestion = document.getElementById('step-question');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const datePanel = document.getElementById('date-panel');
const confirmBtn = document.getElementById('confirm-btn');

// Elemente pentru notificarea personalizată
const customAlert = document.getElementById('custom-alert');
const alertTitle = document.getElementById('custom-alert-title');
const alertMessage = document.getElementById('custom-alert-message');
const alertClose = document.getElementById('custom-alert-close');
const alertIcon = document.querySelector('.custom-alert-icon');

let selectedRating = 0;

// --- INIȚIALIZARE CALENDAR INTELIGENT (SALVAT ÎN VARIABILĂ) ---
const myCalendar = flatpickr("#calendar", {
    locale: Romanian,
    disableMobile: true,
    minDate: "today",
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "j F Y",
    position: "static", // MODIFICAT AICI: Oprește calculele automate ale scriptului
    closeOnSelect: true
});

// --- FIXUL SUPREM PENTRU BLOCARE ÎNCHIDERE LA SCROLL/ATINGERE FUNDAL ---
// Pentru Calculator (mouse)
document.addEventListener("mousedown", function(event) {
    // Verificăm dacă calendarul este creat, dacă e deschis și dacă utilizatorul NU a selectat încă o dată
    if (myCalendar && myCalendar.isOpen && myCalendar.selectedDates.length === 0) {
        // Dacă persoana a dat click pe fundal, pe text sau a tras de ecran (în afara calendarului propriu-zis)
        if (!myCalendar.calendarContainer.contains(event.target) && !event.target.closest(".input-wrapper")) {
            // Oprim browserul din a rula logica de închidere automată
            event.preventDefault();
            event.stopPropagation();
            myCalendar.open(); // Îl forțăm să rămână activ
        }
    }
}, true); // „true” interceptează acțiunea înainte ca Flatpickr să apuce să reacționeze

// Pentru Telefon (touchscreen)
document.addEventListener("touchstart", function(event) {
    if (myCalendar && myCalendar.isOpen && myCalendar.selectedDates.length === 0) {
        if (!myCalendar.calendarContainer.contains(event.target) && !event.target.closest(".input-wrapper")) {
            event.preventDefault();
            event.stopPropagation();
            myCalendar.open();
        }
    }
}, { passive: false, capture: true });


// --- LOGICĂ PAS 1: STELUȚE ---
stars.forEach(star => {
    star.addEventListener('mouseover', () => highlightStars(star.dataset.value));
    star.addEventListener('mouseout', () => highlightStars(selectedRating));
    star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.value);
        highlightStars(selectedRating);
        nextBtn.removeAttribute('disabled');
    });
});

function highlightStars(rating) {
    stars.forEach(star => {
        if (parseInt(star.dataset.value) <= rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

nextBtn.addEventListener('click', () => {
    stepRating.style.display = 'none';
    stepQuestion.style.display = 'block';
});

// --- LOGICĂ PAS 2: BUTONUL CARE FUGE ---
function fugeButonul() {
    noBtn.style.position = 'fixed';
    const maxX = window.innerWidth - noBtn.offsetWidth;
    const maxY = window.innerHeight - noBtn.offsetHeight;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
}

noBtn.addEventListener('mouseover', fugeButonul);
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    fugeButonul();
});

yesBtn.addEventListener('click', () => {
    stepQuestion.style.display = 'none';
    noBtn.style.display = 'none';
    datePanel.style.display = 'block';
});

// --- LOGICĂ NOTIFICARE PERSONALIZATĂ ---
function showAlert(title, message, icon = "❤️") {
    alertTitle.innerText = title;
    alertMessage.innerText = message;
    alertIcon.innerText = icon;
    customAlert.style.display = 'flex';
}

// Închidere pop-up custom la apăsarea butonului X
alertClose.addEventListener('click', () => {
    customAlert.style.display = 'none';
});

customAlert.addEventListener('click', (e) => {
    // Verificăm dacă a apasat direct pe fundal, nu în interiorul căsuței albe
    if (e.target === customAlert) {
        customAlert.style.display = 'none';
    }
});

function creeazaFloriPeFundal() {
    const elemente = ["🌸", "✨", "🌸", "✨"];
    // Generăm 16 elemente ca să umple tot ecranul pe lungime
    for (let i = 0; i < 16; i++) {
        const span = document.createElement("span");
        span.innerText = elemente[Math.floor(Math.random() * elemente.length)];
        span.className = "decor-flower-dinamic";

        // Împrăștiem elementele procentual pe tot ecranul
        const topRandom = Math.floor(Math.random() * 90) + 5; // Între 5% și 95% înălțime
        const leftRandom = Math.floor(Math.random() * 88) + 4; // Între 4% și 92% lățime
        const rotatie = Math.floor(Math.random() * 60) - 30;  // Înclinație romantică

        span.style.top = `${topRandom}%`;
        span.style.left = `${leftRandom}%`;
        span.style.transform = `rotate(${rotatie}deg)`;

        // Dimensiuni diferite pentru un aspect natural
        const dimensiune = Math.floor(Math.random() * 15) + 20; // Între 20px și 35px
        span.style.fontSize = `${dimensiune}px`;

        document.body.appendChild(span);
    }
}

// Pornim ploaia de flori când se încarcă pagina
window.addEventListener("DOMContentLoaded", creeazaFloriPeFundal);

// --- LOGICĂ PAS 3: FIREBASE INTERCONECTATĂ CU NOUL POP-UP ---
confirmBtn.addEventListener('click', async () => {
    const rawDate = document.getElementById('calendar').value; // Format bază de date: Y-m-d

    // Extrage textul frumos scris în română din input-ul generat de Flatpickr (ex: 31 Mai 2026)
    const formattedDate = myCalendar ? myCalendar.altInput.value : rawDate;

    if (!rawDate) {
        showAlert("Oups! 🙈", "Te rog alege o dată înainte de a confirma.", "📅");
        return;
    }

    try {
        // Închidem manual calendarul chiar înainte de a trimite datele, ca să nu rămână peste pop-up-ul de succes
        if (myCalendar) {
            myCalendar.close();
        }

        await addDoc(collection(db, "dates"), {
            rating: selectedRating,
            selectedDate: rawDate,
            createdAt: new Date()
        });

        // Afișează superba ta notificare personalizată
        showAlert("Perfect! 🥰", `Abia aștept! Ne vedem pe ${formattedDate} !`, "❤️");
    } catch (error) {
        console.error(error);
        showAlert("Eroare 😢", "Ceva nu a mers bine la salvarea datelor în Firebase.", "❌");
    }
});