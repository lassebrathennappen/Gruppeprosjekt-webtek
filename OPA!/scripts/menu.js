// Menu Switcher
// Shows one menu category at a time

(function () {
  'use strict';

  var DEFAULT_SECTION = 'dinner';
  var tabs = document.querySelectorAll('.menu-tab');
  var sections = document.querySelectorAll('.menu-section');

  if (tabs.length === 0 || sections.length === 0) {
    return;
  }

  // True if the id belongs to one of the menu sections on this page
  function isSection(id) {
    var element = id ? document.getElementById(id) : null;
    return element !== null && element.classList.contains('menu-section');
  }

  // Show the chosen section, hide the others, and mark the matching tab as active
  function showSection(id) {
    sections.forEach(function (section) {
      section.hidden = section.id !== id;
    });

    tabs.forEach(function (tab) {
      var isActive = tab.getAttribute('href') === '#' + id;
      tab.classList.toggle('active', isActive);
      if (isActive) {
        tab.setAttribute('aria-current', 'true');
      } else {
        tab.removeAttribute('aria-current');
      }
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function (event) {
      event.preventDefault();
      var id = tab.getAttribute('href').slice(1);
      showSection(id);
      history.replaceState(null, '', '#' + id);
    });
  });

  // Lets links like menu.html#special-grill from other pages open the right category
  window.addEventListener('hashchange', function () {
    var id = window.location.hash.slice(1);
    if (isSection(id)) {
      showSection(id);
    }
  });

  var startId = window.location.hash.slice(1);
  showSection(isSection(startId) ? startId : DEFAULT_SECTION);
})();
