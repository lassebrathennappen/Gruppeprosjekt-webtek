// Felles header (navbar) og footer for alle sidene (modularitet).
// Hver HTML-fil har bare tomme <header></header> og <footer></footer>,
// og denne filen fyller dem. Da står navbar og footer bare ett sted.

// Åpningstidene står bare her. Footeren og alle elementer med
// class="opening-hours" henter dem herfra, så de bare må endres ett sted.
const openingDays = "Tuesday–Sunday";
const openingTime = "15–22";

const headerHTML = `
    <a href="index.html" class="logo">OPA!</a>
    <!-- Hamburgerknapp: vises bare på mobil og nettbrett i portrett (se style.css) -->
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav" aria-label="Menu">
        <span class="menu-toggle-bar"></span>
        <span class="menu-toggle-bar"></span>
        <span class="menu-toggle-bar"></span>
    </button>
    <nav id="main-nav" aria-label="Main">
        <ul>
            <li><a href="menu.html">Menu</a></li>
            <li><a href="events.html">Events</a></li>
            <li><a href="about-us.html">About us</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="reservations.html" class="nav-button">Reservations</a></li>
        </ul>
    </nav>
`;

const footerHTML = `
    <div class="footer-logo">
        <a href="index.html" class="logo">OPA!</a>
        <p>EST. 2026</p>
    </div>
    <div class="footer-info">
        <div class="footer-col">
            <h2>Opening hours</h2>
            <p>${openingDays}:<br>${openingTime}</p>
        </div>
        <div class="footer-col">
            <h2>Location</h2>
            <address>
                <a href="https://maps.google.com/?q=Munkegata+1,+7011+Trondheim">Munkegata 1, 7011 Trondheim</a>
            </address>
            <p>Wheelchair accessible</p>
        </div>
        <div class="footer-col">
            <h2>Contact</h2>
            <p><a href="mailto:example@email.com">example@email.com</a></p>
            <p><a href="tel:+4712345678">+47 123 45 678</a></p>
            <p><a href="#">Instagram</a></p>
        </div>
    </div>
`;

// Legger inn header og footer (bare hvis siden har taggen)
const header = document.querySelector("header");
const footer = document.querySelector("footer");

if (header) {
    header.innerHTML = headerHTML;
}
if (footer) {
    footer.innerHTML = footerHTML;
}

// Hamburgermeny: knappen åpner og lukker navbaren på små skjermer.
// aria-expanded forteller skjermlesere om menyen er åpen eller lukket.
const menuToggle = document.querySelector(".menu-toggle");

function setMenuOpen(isOpen) {
    menuToggle.setAttribute("aria-expanded", isOpen);
    header.classList.toggle("menu-open", isOpen);
}

if (menuToggle) {
    menuToggle.addEventListener("click", function () {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        setMenuOpen(!isOpen);
    });

    // Escape lukker menyen og sender fokus tilbake til knappen
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && header.classList.contains("menu-open")) {
            setMenuOpen(false);
            menuToggle.focus();
        }
    });
}

// Fyller inn åpningstidene på sidene som har class="opening-hours"
const openingHoursElements = document.querySelectorAll(".opening-hours");

for (const element of openingHoursElements) {
    element.textContent = "Open " + openingDays + ", " + openingTime;
}

// Finner hvilken side vi er på, f.eks. "menu.html" (forsiden kan være tom "")
const currentPage = window.location.pathname.split("/").pop() || "index.html";

// Markerer siden vi er på i navbaren. CSS-en bruker aria-current="page",
// og skjermlesere sier "current page"
const navLinks = document.querySelectorAll("nav a");

for (const link of navLinks) {
    if (link.getAttribute("href") === currentPage) {
        link.setAttribute("aria-current", "page");
    }
}
