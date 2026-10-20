/* =========================================================
   reservations.js – OPA!
   Reservasjonsflyt (Lasse): husker gjester, dato og tid
   Dynamisk kalender (Marte S): gråer ut utilgjengelige datoer
   ========================================================= */
 
// Alt brukeren har valgt så langt
const booking = {
    guests: null,
    date: null,   // en dato
    time: null    // tekst, f.eks. "19:30-21:30"
};
 
// Stegene i riktig rekkefølge
const steps = ["guests", "date", "time", "contact", "thanks"];
 
/* ---------- Viser ett steg om gangen ---------- */
function showStep(name) {
    const index = steps.indexOf(name);
 
    // Viser bare det valgte steget
    steps.forEach(function (step) {
        document.getElementById("step-" + step).hidden = (step !== name);
    });
 
    // Venstre kolonne: viser boksene for steg som er ferdige
    const summary = document.getElementById("summary");
    summary.hidden = (name === "guests" || name === "thanks");
    document.getElementById("summary-guests").hidden = index <= 0;
    document.getElementById("summary-date").hidden = index <= 1;
    document.getElementById("summary-time").hidden = index <= 2;
 
    updateSummary();
 
    // Flytter fokus til den nye overskriften (for tastatur og skjermlesere)
    document.querySelector("#step-" + name + " h2").focus();
}
 
// Skriver valgene inn i boksene til venstre
function updateSummary() {
    document.getElementById("value-guests").textContent = booking.guests;
    document.getElementById("value-date").textContent = booking.date ? formatDate(booking.date) : "";
    document.getElementById("value-time").textContent = booking.time || "";
}
 
// Gjør om en dato til "25th of September"
function formatDate(date) {
    const day = date.getDate();
    let ending = "th";
    if (day === 1 || day === 21 || day === 31) ending = "st";
    if (day === 2 || day === 22) ending = "nd";
    if (day === 3 || day === 23) ending = "rd";
    const month = date.toLocaleString("en-GB", { month: "long" });
    return day + ending + " of " + month;
}
 
// Gjør én knapp oransj og resten vanlige
function selectButton(clicked, allButtons) {
    allButtons.forEach(function (btn) {
        btn.setAttribute("aria-pressed", "false");
    });
    clicked.setAttribute("aria-pressed", "true");
}
 
/* ---------- STEG 1: Antall gjester ---------- */
const guestButtons = document.querySelectorAll(".guest-btn");
 
// Når man trykker på et tall: husk det, gjør det oransje og vis "Next"
guestButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        booking.guests = Number(btn.dataset.guests);
        selectButton(btn, guestButtons);
        document.getElementById("next-guests").hidden = false;
    });
});
 
// "Next" går videre til dato
document.getElementById("next-guests").addEventListener("click", function () {
    showStep("date");
});
 
/* ---------- STEG 2: Dato ---------- */
 
/* =========================================================
   Dynamisk kalender (JavaScript 4)
   Lager dagene i måneden og viser hvilke som er ledige,
   hvilken som er i dag og hvilke som ikke kan velges.
   ========================================================= */
 
// Dagens dato (uten klokkeslett, så vi kan sammenligne datoer)
const today = new Date();
today.setHours(0, 0, 0, 0);
 
// Måneden som vises nå (starter på denne måneden)
let shownMonth = new Date(today.getFullYear(), today.getMonth(), 1);
 
// Gjør en dato om til tekst, f.eks. "2026-09-25"
function toDateString(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + month + "-" + day;
}
 
// Sjekker om en dag kan bookes
function isAvailable(date) {
    if (date < today) return false;          // dager som har vært
    if (date.getDay() === 1) return false;   // stengt på mandager
    return true;
}
 
// Lager en grå tallrute for dager i forrige eller neste måned
function addOtherMonthDay(grid, number) {
    const cell = document.createElement("span");
    cell.className = "other-month";
    cell.textContent = number;
    cell.setAttribute("aria-hidden", "true"); // skjermleser hopper over disse
    grid.appendChild(cell);
}
 
function buildCalendar() {
    const grid = document.getElementById("calendar-grid");
    grid.innerHTML = "";
 
    const year = shownMonth.getFullYear();
    const month = shownMonth.getMonth();
 
    // Navnet på måneden, f.eks. "September"
    document.getElementById("month-name").textContent =
        shownMonth.toLocaleString("en-GB", { month: "long" });
 
    // Ukedagene øverst
    ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].forEach(function (name) {
        const cell = document.createElement("span");
        cell.className = "weekday";
        cell.textContent = name;
        grid.appendChild(cell);
    });
 
    // Dager fra forrige måned, så den 1. havner på riktig ukedag (mandag = 0)
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysLastMonth = new Date(year, month, 0).getDate();
    for (let i = firstWeekday; i > 0; i--) {
        addOtherMonthDay(grid, daysLastMonth - i + 1);
    }
 
    // Alle dagene i måneden
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "day";
        btn.textContent = day;
        btn.dataset.date = toDateString(date);
        btn.setAttribute("aria-label", formatDate(date));
 
        // Dager som ikke kan velges blir grå og kan ikke trykkes
        btn.disabled = !isAvailable(date);
 
        // Dagens dato får en ekstra ramme
        if (date.getTime() === today.getTime()) {
            btn.classList.add("today");
            btn.setAttribute("aria-current", "date");
        }
 
        // Viser valgt dato som oransje hvis man går tilbake til kalenderen
        const chosen = booking.date && booking.date.getTime() === date.getTime();
        btn.setAttribute("aria-pressed", chosen ? "true" : "false");
 
        grid.appendChild(btn);
    }
 
    // Dager fra neste måned, så den siste raden blir full
    const rest = (7 - ((firstWeekday + daysInMonth) % 7)) % 7;
    for (let day = 1; day <= rest; day++) {
        addOtherMonthDay(grid, day);
    }
 
    // Kan ikke gå tilbake til måneder som har vært
    document.getElementById("prev-month").disabled =
        year === today.getFullYear() && month === today.getMonth();
}
 
// Pilene bytter måned
document.getElementById("prev-month").addEventListener("click", function () {
    shownMonth.setMonth(shownMonth.getMonth() - 1);
    buildCalendar();
});
 
document.getElementById("next-month").addEventListener("click", function () {
    shownMonth.setMonth(shownMonth.getMonth() + 1);
    buildCalendar();
});
 
// Lager kalenderen når siden lastes
buildCalendar();
 
// Når man trykker på en dag, huskes den og blir oransje
document.getElementById("calendar-grid").addEventListener("click", function (event) {
    const btn = event.target.closest(".day");
    if (!btn || btn.disabled) return;
 
    const parts = btn.dataset.date.split("-");
    booking.date = new Date(parts[0], parts[1] - 1, parts[2]);
    booking.time = null; // ny dato = må velge tid på nytt
 
    selectButton(btn, document.querySelectorAll("#calendar-grid .day"));
    document.getElementById("next-date").hidden = false;
});
 
// "Next" lager tidspunktene og går videre
document.getElementById("next-date").addEventListener("click", function () {
    buildTimes();
    showStep("time");
});
 
/* ---------- STEG 3: Tidspunkt ---------- */
// Alle tidspunktene man kan velge
const allTimes = [
    "15:00-17:00", "15:30-17:30",
    "16:00-18:00", "16:30-18:30",
    "17:00-19:00", "17:30-19:30",
    "18:00-20:00", "18:30-20:30",
    "19:00-21:00", "19:30-21:30",
    "20:00-22:00"
];
 
// Lager en knapp for hvert tidspunkt
function buildTimes() {
    const grid = document.getElementById("time-grid");
    grid.innerHTML = "";
 
    allTimes.forEach(function (time) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "time-btn";
        btn.textContent = time;
        btn.setAttribute("aria-pressed", time === booking.time ? "true" : "false");
 
        btn.addEventListener("click", function () {
            booking.time = time;
            selectButton(btn, grid.querySelectorAll(".time-btn"));
            document.getElementById("next-time").hidden = false;
        });
 
        grid.appendChild(btn);
    });
 
    // Viser "Next" hvis en tid allerede er valgt
    document.getElementById("next-time").hidden = !booking.time;
}
 
document.getElementById("next-time").addEventListener("click", function () {
    showStep("contact");
});
 
/* ---------- STEG 4: Kontaktinfo ---------- */
 
/* =========================================================
   Skjemavalidering (JavaScript 3)
   Viser feilmelding hvis navn eller e-post mangler eller er feil.
   ========================================================= */
 
// Viser eller fjerner feilmeldingen under et felt
function showError(input, message) {
    const error = document.getElementById(input.id + "-error");
    error.textContent = message;
    error.hidden = (message === "");
    // Forteller skjermlesere om feltet er feil
    input.setAttribute("aria-invalid", message === "" ? "false" : "true");
}
 
// Sjekker e-post og navn. Gir true hvis alt er riktig
function validateForm() {
    const email = document.getElementById("email");
    const name = document.getElementById("first-name");
    let firstWrong = null;
 
    // E-post: må fylles ut og se ut som en e-post (noe@noe.noe)
    const emailValue = email.value.trim();
    if (emailValue === "") {
        showError(email, "Please enter your email.");
        firstWrong = firstWrong || email;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
        showError(email, "Please enter a valid email, for example name@gmail.com.");
        firstWrong = firstWrong || email;
    } else {
        showError(email, "");
    }
 
    // Navn: må fylles ut
    if (name.value.trim() === "") {
        showError(name, "Please enter your name.");
        firstWrong = firstWrong || name;
    } else {
        showError(name, "");
    }
 
    // Flytter markøren til det første feltet som er feil
    if (firstWrong) {
        firstWrong.focus();
        return false;
    }
    return true;
}
 
// Fjerner feilmeldingen mens brukeren retter feltet
["email", "first-name"].forEach(function (id) {
    const input = document.getElementById(id);
    input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true" && input.value.trim() !== "") {
            showError(input, "");
        }
    });
});
 
document.getElementById("contact-form").addEventListener("submit", function (event) {
    event.preventDefault(); // hindrer at siden lastes på nytt
 
    // Stopper hvis e-post eller navn er feil (skjemavalidering)
    if (!validateForm()) return;
 
    // Viser e-posten på takkesiden
    const email = document.getElementById("email").value.trim();
    document.getElementById("thanks-email").textContent = email;
    showStep("thanks");
});
 
/* ---------- Blyant-knappene: gå tilbake og endre et valg ---------- */
document.querySelectorAll(".edit-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
        const step = btn.dataset.step;
        if (step === "date") buildCalendar();
        if (step === "time") buildTimes();
        showStep(step);
    });
});


