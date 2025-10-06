/**
 * Main JavaScript file for the portfolio website
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing main.js");
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    // Check if we found a navbar before adding event listeners
    if (navbar) {
        console.log("Navbar found, adding scroll effect");
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.padding = '0.5rem 0';
                navbar.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
            } else {
                navbar.style.padding = '1rem 0';
                navbar.style.backgroundColor = 'rgba(15, 23, 42, 0.9)';
            }
        });
    } else {
        console.warn("Navbar not found");
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav item
                document.querySelectorAll('.nav-link').forEach(navLink => {
                    navLink.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // Navbar active state based on scroll position
    function updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100; // Offset for navbar height
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelector('.navbar-nav a[href="#' + sectionId + '"]')?.classList.add('active');
            } else {
                document.querySelector('.navbar-nav a[href="#' + sectionId + '"]')?.classList.remove('active');
            }
        });
    }
    
    // Listen for scroll events to update active nav item
    window.addEventListener('scroll', updateActiveNavOnScroll);
    
    // Add animations to elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.skill-card, .project-card, .stat-item');
        const triggerBottom = window.innerHeight * 0.8;
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Run animation check on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load
    
    // Apply initial styles for animation
    document.querySelectorAll('.skill-card, .project-card, .stat-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Check path to help with debugging
    console.log("Current page path:", window.location.pathname);
    
    // Add active class to nav link for current page based on URL
    setTimeout(function() {
        const currentLocation = window.location.pathname;
        console.log("Setting active nav based on:", currentLocation);
        const navLinks = document.querySelectorAll('.navbar-nav a');
        
        if (navLinks.length > 0) {
            console.log("Found", navLinks.length, "navigation links");
            navLinks.forEach(link => {
                const linkPath = link.getAttribute('href');
                console.log("Checking link:", linkPath);
                
                if ((currentLocation === '/' || currentLocation === '/index.html') && 
                   (linkPath === '/' || linkPath === '/index.html')) {
                    console.log("Active: Home page");
                    link.classList.add('active');
                }
                else if ((currentLocation === '/about.html' || currentLocation === '/about') && 
                        (linkPath === '/about.html' || linkPath === '/about')) {
                    console.log("Active: About page");
                    link.classList.add('active');
                }
                else if ((currentLocation === '/projects.html' || currentLocation === '/projects') && 
                        (linkPath === '/projects.html' || linkPath === '/projects')) {
                    console.log("Active: Projects page");
                    link.classList.add('active');
                }
                else if ((currentLocation === '/contact.html' || currentLocation === '/contact') && 
                        (linkPath === '/contact.html' || linkPath === '/contact')) {
                    console.log("Active: Contact page");
                    link.classList.add('active');
                }
            });
        } else {
            console.warn("No navigation links found");
        }
    }, 500);  // Give a small delay to ensure components are loaded
});

