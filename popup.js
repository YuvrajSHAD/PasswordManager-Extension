document.addEventListener('DOMContentLoaded', function() {
    // Fetch the text file containing passwords
    fetch(chrome.runtime.getURL('passwords.txt'))
      .then(response => response.text())
      .then(data => {
        var lines = data.split('\n');
        var profiles = {};
        var currentProfile = null;
  
        // Extract profiles and their corresponding site-password pairs
        lines.forEach(line => {
          if (!line.trim()) {
            // Skip empty lines
            return;
          }
          if (!line.includes(':')) {
            // If the line is a profile name
            currentProfile = line.trim();
            profiles[currentProfile] = [];
          } else {
            // If the line is a site-password pair
            var parts = line.split(':');
            var site = parts[0].trim();
            var password = parts[1].trim();
            profiles[currentProfile].push({ site: site, password: password });
          }
        });
  
        // Create buttons for each profile
        Object.keys(profiles).forEach(profile => {
          var profileButton = document.createElement('button');
          profileButton.textContent = profile;
          profileButton.addEventListener('click', function() {
            toggleProfileButtons(profiles[profile]);
          });
          document.querySelector('.container').appendChild(profileButton);
        });
      })
      .catch(error => {
        console.error('Error fetching passwords:', error);
      });
  });
  
  function toggleProfileButtons(profilePasswords) {
    var siteContainer = document.querySelector('#site-container');
    
    // If site buttons for this profile already exist, remove them
    if (siteContainer) {
      siteContainer.remove();
      return; // Exit function to prevent creating duplicate buttons
    }
  
    // Create a container for site buttons
    siteContainer = document.createElement('div');
    siteContainer.id = 'site-container';
  
    // Create buttons for each site in the profile
    profilePasswords.forEach(pair => {
      var button = document.createElement('button');
      button.textContent = pair.site;
      button.classList.add('site-button'); // Add a class to customize in CSS
      button.addEventListener('click', function() {
        copyPassword(pair.password);
      });
      siteContainer.appendChild(button);
    });
  
    // Add the site buttons to the document
    document.querySelector('.container').appendChild(siteContainer);
  }
  
  function copyPassword(password) {
    // Copy the password to the clipboard
    navigator.clipboard.writeText(password)
      .then(function() {
        console.log('Password copied to clipboard');
      })
      .catch(function(error) {
        console.error('Failed to copy password: ', error);
      });
  }
  