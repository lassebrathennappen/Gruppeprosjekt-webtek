// Felles header (navbar) og footer for alle sidene (modularitet).
// Hver HTML-fil har bare tomme <header></header> og <footer></footer>,
// og denne filen fyller dem. Da står navbar og footer bare ett sted.

const headerHTML = `
    <a href="index.html" class="logo">OPA!</a>
    <nav>
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
            <p>Tuesday–Sunday:<br>15–22</p>
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
