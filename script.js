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

// --- INIȚIALIZARE CALENDAR INTELIGENT ---
flatpickr("#calendar", {
    locale: Romanian,
    disableMobile: true,
    minDate: "today",
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "j F Y",
    position: "auto left" // Îl pune în dreapta pe PC și jos pe telefon automat
});

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

// Închiriere pop-up custom la apăsarea butonului
alertClose.addEventListener('click', () => {
    customAlert.style.display = 'none';
});

alertClose.addEventListener('click', () => {
    customAlert.style.display = 'none';
});

customAlert.addEventListener('click', (e) => {
    // Verificăm dacă a apasat direct pe fundal, nu în interiorul căsuței albe
    if (e.target === customAlert) {
        customAlert.style.display = 'none';
    }
});

// --- LOGICĂ PAS 3: FIREBASE INTERCONECTATĂ CU NOUL POP-UP ---
confirmBtn.addEventListener('click', async () => {
    const rawDate = document.getElementById('calendar').value; // Format bază de date: Y-m-d
    const calendarInstance = document.getElementById('calendar')._flatpickr;

    // Extrage textul frumos scris în română din input-ul generat de Flatpickr (ex: 31 Mai 2026)
    const formattedDate = calendarInstance ? calendarInstance.altInput.value : rawDate;

    if (!rawDate) {
        showAlert("Oups! 🙈", "Te rog alege o dată înainte de a confirma.", "📅", false);
        return;
    }

    try {
        await addDoc(collection(db, "dates"), {
            rating: selectedRating,
            selectedDate: rawDate,
            createdAt: new Date()
        });

        // Afișează superba ta notificare personalizată
        showAlert("Perfect! 🥰", `Abia aștept! Ne vedem pe ${formattedDate} !`, "❤️", true);
    } catch (error) {
        console.error(error);
        showAlert("Eroare 😢", "Ceva nu a mers bine la salvarea datelor în Firebase.", "❌", false);
    }
});