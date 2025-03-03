// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Offset for fixed navbar
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
        const elements = document.querySelectorAll('.fade-in');
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
    
    // Add active class to nav link for current page
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentLocation || 
            (currentLocation === '/' || currentLocation === '/index.html') && linkPath === '#about') {
            link.classList.add('active');
        }
    });
});

