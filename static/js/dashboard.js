'use strict';



/**
 * add event on element
 */

const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}



/**
 * navbar toggle
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
}

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
}

addEventOnElem(navLinks, "click", closeNavbar);



/**
 * header active
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});



/**
 * scroll reveal effect
 */

const sections = document.querySelectorAll("[data-section]");

const reveal = function () {
  for (let i = 0; i < sections.length; i++) {

    if (sections[i].getBoundingClientRect().top < window.innerHeight / 2) {
      sections[i].classList.add("active");
    }

  }
}

reveal();
addEventOnElem(window, "scroll", reveal);

/**
 * Smooth scrolling for navigation links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

/**
 * Update active navbar link based on scroll position
 */
const updateActiveNavLink = function() {
  const scrollPosition = window.scrollY + 100; // Offset for better detection
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  
  // Remove active class from all nav links first
  navLinks.forEach(link => link.classList.remove('active'));
  
  // Check if we're near the bottom of the page (footer section)
  if (scrollPosition + windowHeight >= documentHeight - 100) {
    document.querySelector('[data-nav-link][href="#footer"]').classList.add('active');
    return;
  }
  
  // Get all sections
  const sections = document.querySelectorAll('section[id]');
  let currentSection = null;
  let smallestDistance = Infinity;
  
  // Find the section closest to the current scroll position
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionMiddle = sectionTop + (sectionHeight / 2);
    const distanceFromMiddle = Math.abs(scrollPosition - sectionMiddle);
    
    // If this section is closer to the current scroll position than previous ones
    if (distanceFromMiddle < smallestDistance) {
      smallestDistance = distanceFromMiddle;
      currentSection = section.getAttribute('id');
    }
  });
  
  // Highlight only the current section's nav link
  if (currentSection) {
    const activeLink = document.querySelector(`[data-nav-link][href="#${currentSection}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }
};

// Add scroll event listener to update active nav link
window.addEventListener('scroll', updateActiveNavLink);

// Initial call to set active nav link
updateActiveNavLink();
'use strict';

/**
 * add event on element
 */
const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}

/**
 * navbar toggle
 */
const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
}

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
}

addEventOnElem(navLinks, "click", closeNavbar);

/**
 * header active
 */
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});

/**
 * scroll reveal effect
 */
const sections = document.querySelectorAll("[data-section]");

const reveal = function () {
  for (let i = 0; i < sections.length; i++) {
    if (sections[i].getBoundingClientRect().top < window.innerHeight / 2) {
      sections[i].classList.add("active");
    }
  }
}

reveal();
addEventOnElem(window, "scroll", reveal);

/**
 * Smooth scrolling for navigation links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

/**
 * Update active navbar link based on scroll position
 */
const updateActiveNavLink = function() {
  const scrollPosition = window.scrollY + 100; // Offset for better detection
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  
  // Remove active class from all nav links first
  navLinks.forEach(link => link.classList.remove('active'));
  
  // Check if we're near the bottom of the page (footer section)
  if (scrollPosition + windowHeight >= documentHeight - 100) {
    document.querySelector('[data-nav-link][href="#footer"]').classList.add('active');
    return;
  }
  
  // Get all sections
  const sections = document.querySelectorAll('section[id]');
  let currentSection = null;
  let smallestDistance = Infinity;
  
  // Find the section closest to the current scroll position
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionMiddle = sectionTop + (sectionHeight / 2);
    const distanceFromMiddle = Math.abs(scrollPosition - sectionMiddle);
    
    // If this section is closer to the current scroll position than previous ones
    if (distanceFromMiddle < smallestDistance) {
      smallestDistance = distanceFromMiddle;
      currentSection = section.getAttribute('id');
    }
  });
  
  // Highlight only the current section's nav link
  if (currentSection) {
    const activeLink = document.querySelector(`[data-nav-link][href="#${currentSection}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }
};

// Add scroll event listener to update active nav link
window.addEventListener('scroll', updateActiveNavLink);

// Initial call to set active nav link
updateActiveNavLink();

// Make service cards clickable
document.addEventListener('DOMContentLoaded', function() {
  // Initialize service card buttons
  const cardButtons = document.querySelectorAll('.card-button');
  
  cardButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Prevent the event from bubbling up to the card
      e.stopPropagation();
      
      // Get the parent card
      const card = this.closest('.service-card');
      
      // Get the URL from the card's onclick attribute
      const url = card.getAttribute('onclick').replace("window.location='", "").replace("')", "");
      
      // Navigate to the URL
      window.location = url;
    });
  });
  
  // Add animation effects for better user experience
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.classList.add('hover');
    });
    
    card.addEventListener('mouseleave', function() {
      this.classList.remove('hover');
    });
  });
});