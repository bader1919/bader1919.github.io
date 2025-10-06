/**
 * Image Placeholder Handler
 * This script automatically handles missing images by displaying placeholders
 * until the actual images are available.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Define image paths that need placeholders
  const expectedImages = [
    '/assets/img/profile.jpg',
    '/assets/img/airbnb.png',
    '/assets/img/home-assistant.png',
    '/assets/img/customer-churn.png',
    '/assets/img/kickstarter.jpg',
    '/assets/img/ba-service.jpg',
    '/assets/img/food-supply.jpg',
    '/assets/img/home-assistant-capstone.jpg',
    '/assets/img/global-food.jpg',
    '/assets/img/favicon.ico'
  ];

  // Color palette for placeholder backgrounds
  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6'  // purple
  ];

  // Map of project types to icons
  const projectIcons = {
    'airbnb-analysis': 'fa-chart-bar',
    'home-assistant': 'fa-home',
    'customer-churn': 'fa-users',
    'kickstarter': 'fa-rocket',
    'ba-service': 'fa-plane',
    'food-supply': 'fa-utensils',
    'profile': 'fa-user',
    'global-food': 'fa-globe',
    'home-assistant-capstone': 'fa-tools'
  };
  
  // Custom placeholder images
  const customPlaceholders = {
    '/assets/img/profile.jpg': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKIAAAAaCAYAAAA0a4cDAAAAAXNSR0IArs4c6QAAAW1JREFUeF7tmyGOwlAYhKdsCWxWVRFOwA0q0ATFARCEI3ADFDfgCATBAVAcAFGBhhMQFGqzJe3Cpk2oIYiVM53n2vz/y0y+z77gOhg8UJPTnkwQxjGy3Q637fZt649eD+3pFPfLBT/LZTVX7Df7feTHY/n/OVcMpKsVfk8ntEYjNIdD5EmCdL1GM47RGo+RHw7l9+dshkanU81/zecIogi3zQZZkrzs1wQNAov4ivqdiMXkU7QgDMvF+/mM78WiuuS/IhaLhYyNbre6I9vvS2nrdGolYp3AsnW1iGzERPNaRFGwbLUsIhsx0bwWURQsWy2LyEZMNK9FFAXLVssishETzWsRRcGy1bKIbMRE81pEUbBstSwiGzHRvBZRFCxbLYvIRkw0r0UUBctWyyKyERPNaxFFwbLVsohsxETzWkRRsGy1LCIbMdG8FlEULFsti8hGTDSvRRQFy1arFiI+3yk3ogiPNK0es7PBUs77B49yqRf6EqpoAAAAAElFTkSuQmCC'
  };

  // Handle error for each image
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      const imgPath = this.getAttribute('src');
      
      // Check if we have a custom placeholder for this image
      if (customPlaceholders[imgPath]) {
        this.src = customPlaceholders[imgPath];
        this.classList.add('placeholder-image');
        return;
      }
      
      // Only create placeholders for expected images
      if (expectedImages.includes(imgPath)) {
        createPlaceholder(this, imgPath);
      }
    });
    
    // Also check images that have already failed to load
    if (img.complete && img.naturalHeight === 0) {
      const imgPath = img.getAttribute('src');
      
      // Check if we have a custom placeholder for this image
      if (customPlaceholders[imgPath]) {
        img.src = customPlaceholders[imgPath];
        img.classList.add('placeholder-image');
        return;
      }
      
      if (expectedImages.includes(imgPath)) {
        createPlaceholder(img, imgPath);
      }
    }
  });

  function createPlaceholder(imgElement, imgPath) {
    // Get image dimensions from current element or set defaults
    const width = imgElement.width || imgElement.clientWidth || 300;
    const height = imgElement.height || imgElement.clientHeight || 200;
    
    // Create canvas for placeholder
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Determine project type from image path
    const fileName = imgPath.split('/').pop().split('.')[0];
    
    // Pick a consistent color based on the filename
    const colorIndex = Math.abs(fileName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length;
    const bgColor = colors[colorIndex];
    
    // Draw background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    
    // Add text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = `${Math.max(16, width / 15)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Format the name for display
    const displayName = fileName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    ctx.fillText(displayName, width / 2, height / 2 - 15);
    
    // Add icon if available
    const icon = projectIcons[fileName] || 'fa-image';
    ctx.fillText(`⟨${icon}⟩`, width / 2, height / 2 + 20);
    
    // Add "Image Coming Soon" text
    ctx.font = `${Math.max(12, width / 25)}px Arial`;
    ctx.fillText('Image Coming Soon', width / 2, height / 2 + 50);
    
    // Replace the image source with canvas data URL
    imgElement.src = canvas.toDataURL('image/png');
    
    // Add a class for styling
    imgElement.classList.add('placeholder-image');
    
    // Add title for hover information
    imgElement.title = `Placeholder for: ${displayName}`;
  }
});
