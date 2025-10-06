/**
 * Simple component loader for the portfolio website
 * Loads HTML components like header, footer, etc.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Load all components with an id that ends with -placeholder or is header or footer
  const componentElements = document.querySelectorAll('[id$="-placeholder"], #footer, #header, #header-component, #footer-component');
  
  componentElements.forEach(element => {
    let componentName = element.id;
    
    // If the element has a generic id like "footer" or "header",
    // use that as the component name
    if (componentName === 'footer' || componentName === 'header' || 
        componentName === 'footer-component' || componentName === 'header-component' ||
        componentName === 'footer-placeholder' || componentName === 'header-placeholder') {
      // Extract just the base component name
      componentName = componentName.replace('-component', '').replace('-placeholder', '');
    } else {
      // Otherwise, strip any suffixes
      componentName = componentName.replace('-component', '').replace('-placeholder', '');
    }
    
    // Fetch and load the component with error handling
    fetch(`/components/${componentName}.html`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load component: ${componentName} (${response.status})`);
        }
        return response.text();
      })
      .then(html => {
        element.innerHTML = html;
        
        // Execute any scripts inside the component
        const scripts = element.querySelectorAll('script');
        scripts.forEach(script => {
          const newScript = document.createElement('script');
          
          // Copy all attributes
          Array.from(script.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
          });
          
          // Copy the content
          newScript.appendChild(document.createTextNode(script.textContent));
          
          // Replace the old script with the new one
          script.parentNode.replaceChild(newScript, script);
        });
        
        // After header is loaded, mark the correct nav link as active
        if (componentName === 'header') {
          setActiveNavLink();
          // Dispatch an event that header has been loaded
          document.dispatchEvent(new Event('headerLoaded'));
        }
      })
      .catch(error => {
        console.error(`Error loading component ${componentName}:`, error);
        element.innerHTML = `<p class="text-danger">Failed to load component: ${componentName}</p>`;
      });
  });

  // Function to set active navigation link based on current page
  function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    console.log("Current path:", currentPath);
    
    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href');
      console.log("Link path:", linkPath);
      
      // For the home page
      if ((currentPath === '/' || currentPath === '/index.html') && 
         (linkPath === '/' || linkPath === '/index.html')) {
        link.classList.add('active');
      }
      // For about page
      else if ((currentPath === '/about.html' || currentPath === '/about') && 
              (linkPath === '/about.html' || linkPath === '/about')) {
        link.classList.add('active');
      }
      // For projects page
      else if ((currentPath === '/projects.html' || currentPath === '/projects') && 
              (linkPath === '/projects.html' || linkPath === '/projects')) {
        link.classList.add('active');
      }
      // For contact page
      else if ((currentPath === '/contact.html' || currentPath === '/contact') && 
              (linkPath === '/contact.html' || linkPath === '/contact')) {
        link.classList.add('active');
      }
      // For other subpages, check if the path contains the link
      else if (linkPath !== '/' && linkPath !== '/index.html' && 
              currentPath.includes(linkPath.replace('.html', ''))) {
        link.classList.add('active');
      }
    });
  }
});

