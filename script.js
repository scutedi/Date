const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('yes-btn');
const confirmBtn = document.getElementById('confirm-btn');
const btnGroup = document.getElementById('btn-group');
const datePanel = document.getElementById('date-panel');
const mainTitle = document.getElementById('question');

// 1. Funcția care face butonul "NU" să fugă
noBtn.addEventListener('mouseover', () => {
    // Calculăm dimensiunile ferestrei pentru a nu ieși din ecran
    const maxX = window.innerWidth - noBtn.offsetWidth;
    const maxY = window.innerHeight - noBtn.offsetHeight;

    // Generăm poziții random
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    // Aplicăm noile coordonate
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
});

// 2. Funcția pentru butonul "DA"
yesBtn.addEventListener('click', () => {
    mainTitle.innerText = "Mă bucur mult! ❤️";
    btnGroup.classList.add('hidden'); // Ascundem butoanele
    noBtn.classList.add('hidden');   // Ne asigurăm că butonul NU dispare de tot
    datePanel.classList.remove('hidden'); // Afișăm calendarul
});

// 3. Funcția pentru confirmarea datei
confirmBtn.addEventListener('click', () => {
    const dateValue = document.getElementById('calendar').value;
    if (dateValue) {
        alert(`Super! Ne vedem pe data de: ${dateValue} !`);
    } else {
        alert("Te rog să alegi o dată înainte de a confirma.");
    }
});
