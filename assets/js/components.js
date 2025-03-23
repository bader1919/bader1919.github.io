/**
 * Components.js
 * Utility script to load common components (header and footer) into HTML pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load the header component
    loadComponent('header', 'assets/components/header.html');
    
    // Load the footer component
    loadComponent('footer', 'assets/components/footer.html');
});

/**
 * Loads an HTML component into a specified element
 * @param {string} elementId - The ID of the element to inject the component into
 * @param {string} componentPath - The path to the component HTML file
 */
function loadComponent(elementId, componentPath) {
    const element = document.getElementById(elementId);
    
    if (!element) {
        console.error(`Element with ID "${elementId}" not found.`);
        return;
    }
    
    fetch(componentPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${componentPath}: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            element.innerHTML = html;
            
            // Execute any scripts within the loaded component
            const scripts = element.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                
                // Copy all attributes
                Array.from(script.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                });
                
                // Copy inline content
                newScript.textContent = script.textContent;
                
                // Replace the old script with the new one
                script.parentNode.replaceChild(newScript, script);
            });
            
            // Dispatch a custom event to notify that the component has been loaded
            const event = new CustomEvent(`${elementId}Loaded`);
            document.dispatchEvent(event);
        })
        .catch(error => {
            console.error(`Error loading component: ${error.message}`);
            element.innerHTML = `<div class="component-error">Failed to load ${componentPath}</div>`;
        });
}

/**
 * Utility function for setting the active state of navigation links
 * Should be called after the header is loaded
 */
function setActiveNavLink() {
    document.addEventListener('headerLoaded', function() {
        // Get the current page path
        const currentPath = window.location.pathname;
        const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1);
        
        // Find matching navigation link and add active class
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Direct match for filename
            if (href === filename || 
                // Special case for home page
                (filename === '' && href === 'index.html') ||
                // Match for paths with the same filename
                href.endsWith('/' + filename)) {
                
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    });
    
    // Call this function immediately
    setActiveNavLink();
}

