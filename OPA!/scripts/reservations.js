/* =========================================================
   reservations.js – OPA!
   Reservasjonsflyt (Lasse): husker gjester, dato og tid
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
 
// Gjør én knapp oransje og resten vanlige
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
   TODO Marte S – Dynamisk kalender (JavaScript 4)
   ========================================================= */
 
// Lasse: når man trykker på en dag, huskes den og blir oransje
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
        btn.disabled = bookedTimes.includes(time); // opptatt = grå
        btn.setAttribute("aria-pressed", time === booking.time ? "true" : "false");
 
        btn.addEventListener("click", function () {
            booking.time = time;
            selectButton(btn, grid.querySelectorAll(".time-btn"));
            document.getElementById("next-time").hidden = false;
        });
 
        grid.appendChild(btn);
    });
}
 
document.getElementById("next-time").addEventListener("click", function () {
    showStep("contact");
});
 
/* ---------- STEG 4: Kontaktinfo ---------- */
document.getElementById("contact-form").addEventListener("submit", function (event) {
    event.preventDefault(); // hindrer at siden lastes på nytt
 
    /* =====================================================
       TODO Marte K – Skjemavalidering (JavaScript 3)
       Sjekk navn og e-post her og vis feilmeldinger.
       ===================================================== */
 
    // Viser e-posten på takkesiden
    const email = document.getElementById("email").value;
    document.getElementById("thanks-email").textContent = email;
    showStep("thanks");
});
 
/* ---------- Blyant-knappene: gå tilbake og endre et valg ---------- */
document.querySelectorAll(".edit-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
        const step = btn.dataset.step;
        if (step === "time") buildTimes();
        showStep(step);
    });
});
