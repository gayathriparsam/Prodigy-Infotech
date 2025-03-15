// DOM Elements
const hamburger = document.querySelector(".hamburger")
const navLinks = document.querySelector(".nav-links")
const themeToggle = document.querySelector(".theme-toggle")
const navItems = document.querySelectorAll(".nav-links a")
const filterBtns = document.querySelectorAll(".filter-btn")
const projectCards = document.querySelectorAll(".project-card")
const contactForm = document.getElementById("contactForm")

// Mobile Navigation Toggle
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active")
  navLinks.classList.toggle("active")
})

// Close mobile menu when clicking on a nav item
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    hamburger.classList.remove("active")
    navLinks.classList.remove("active")
  })
})

// Theme Toggle (Dark/Light Mode)
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode")

  // Update icon
  const icon = themeToggle.querySelector("i")
  if (document.body.classList.contains("dark-mode")) {
    icon.classList.remove("fa-moon")
    icon.classList.add("fa-sun")
    localStorage.setItem("theme", "dark")
  } else {
    icon.classList.remove("fa-sun")
    icon.classList.add("fa-moon")
    localStorage.setItem("theme", "light")
  }
})

// Check for saved theme preference
const savedTheme = localStorage.getItem("theme")
if (savedTheme === "dark") {
  document.body.classList.add("dark-mode")
  const icon = themeToggle.querySelector("i")
  icon.classList.remove("fa-moon")
  icon.classList.add("fa-sun")
}

// Active Navigation Link on Scroll
window.addEventListener("scroll", () => {
  const scrollPosition = window.scrollY

  // Add header shadow on scroll
  const header = document.querySelector("header")
  if (scrollPosition > 50) {
    header.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)"
  } else {
    header.style.boxShadow = "none"
  }

  // Highlight active nav link
  document.querySelectorAll("section").forEach((section) => {
    const sectionTop = section.offsetTop - 100
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute("id")

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navItems.forEach((item) => {
        item.classList.remove("active")
        if (item.getAttribute("href") === `#${sectionId}`) {
          item.classList.add("active")
        }
      })
    }
  })
})

// Project Filtering
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active class from all buttons
    filterBtns.forEach((btn) => btn.classList.remove("active"))

    // Add active class to clicked button
    btn.classList.add("active")

    const filterValue = btn.getAttribute("data-filter")

    // Filter projects
    projectCards.forEach((card) => {
      if (filterValue === "all" || card.getAttribute("data-category") === filterValue) {
        card.style.display = "block"
        setTimeout(() => {
          card.style.opacity = "1"
          card.style.transform = "scale(1)"
        }, 200)
      } else {
        card.style.opacity = "0"
        card.style.transform = "scale(0.8)"
        setTimeout(() => {
          card.style.display = "none"
        }, 300)
      }
    })
  })
})

// Contact Form Validation and Submission
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Get form values
    const name = document.getElementById("name").value.trim()
    const email = document.getElementById("email").value.trim()
    const subject = document.getElementById("subject").value.trim()
    const message = document.getElementById("message").value.trim()

    // Simple validation
    if (name === "" || email === "" || subject === "" || message === "") {
      alert("Please fill in all fields")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address")
      return
    }

    // Form submission would normally go here
    // For demo purposes, we'll just show a success message
    alert("Thank you for your message! I will get back to you soon.")
    contactForm.reset()
  })
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()

    const targetId = this.getAttribute("href")
    const targetElement = document.querySelector(targetId)

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 70,
        behavior: "smooth",
      })
    }
  })
})

// Animation on scroll
window.addEventListener("load", () => {
  const animateElements = document.querySelectorAll(".skill-item, .project-card, .about-image, .about-text")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate")
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 },
  )

  animateElements.forEach((element) => {
    observer.observe(element)
  })
})

// Add animation classes
document.querySelectorAll(".skill-item, .project-card, .about-image, .about-text").forEach((element) => {
  element.style.opacity = "0"
  element.style.transform = "translateY(20px)"
  element.style.transition = "opacity 0.5s ease, transform 0.5s ease"
})

// Animation class
document.head.insertAdjacentHTML(
  "beforeend",
  `
  <style>
    .animate {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  </style>
`,
)

