// Select the search form and input
const searchForm = document.querySelector('.search-bar form');
const searchInput = document.querySelector('.search-bar input[type="text"]');

// Handle search form submission
searchForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page

    const query = searchInput.value.toLowerCase().trim(); // Get the search query
    if (!query) {
        showNoResultsPopup('Please enter a search term.');
        return;
    }

    // Get all links on the page
    const links = document.querySelectorAll('a');
    let bestMatch = null;
    let bestScore = 0;

    // Fuzzy matching algorithm
    links.forEach((link) => {
        const text = link.textContent.toLowerCase();
        const href = link.getAttribute('href').toLowerCase();

        // Calculate similarity score
        const score = calculateSimilarity(query, text);
        if (score > bestScore) {
            bestScore = score;
            bestMatch = link;
        }
    });

    // Redirect to the best match if it meets a threshold
    if (bestMatch && bestScore > 0.5) { // Adjust threshold as needed
        window.location.href = bestMatch.getAttribute('href');
    } else {
        showNoResultsPopup('No matching results found.');
    }
});

// Function to calculate similarity between two strings
function calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    const longerLength = longer.length;
    if (longerLength === 0) return 1.0;

    const editDistance = getEditDistance(longer, shorter);
    return (longerLength - editDistance) / longerLength;
}

// Function to calculate edit distance (Levenshtein distance)
function getEditDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // Substitution
                    matrix[i][j - 1] + 1,     // Insertion
                    matrix[i - 1][j] + 1      // Deletion
                );
            }
        }
    }

    return matrix[str2.length][str1.length];
}

// Function to show the "No results found" pop-out
function showNoResultsPopup(message) {
    // Remove any existing pop-out
    const existingPopup = document.getElementById('no-results-popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    // Create the pop-out container
    const popup = document.createElement('div');
    popup.id = 'no-results-popup';
    popup.innerHTML = `
        <p>${message}</p>
        <button id="close-popup">Close</button>
    `;

    // Append the pop-out to the body
    document.body.appendChild(popup);

    // Add event listener to close the pop-out
    const closeButton = document.getElementById('close-popup');
    closeButton.addEventListener('click', () => {
        popup.remove();
    });
}

// Admin Dashboard __________________________________________

// Select elements
const adminLoginBtn = document.getElementById('admin-login-btn');
const adminLoginModal = document.getElementById('admin-login-modal');
const closeAdminLoginBtn = document.getElementById('close-admin-login-btn');
const adminLoginForm = document.getElementById('admin-login-form');
const adminDashboardModal = document.getElementById('admin-dashboard-modal');
const closeAdminDashboardBtn = document.getElementById('close-admin-dashboard-btn');
const addSectionBtn = document.getElementById('add-section-btn');
const editSectionBtn = document.getElementById('edit-section-btn');
const addSectionForm = document.getElementById('add-section-form');
const editSectionForm = document.getElementById('edit-section-form');
const newSectionForm = document.getElementById('new-section-form');
const sectionSelect = document.getElementById('section-select');
const editSectionTitle = document.getElementById('edit-section-title');
const editSectionContent = document.getElementById('edit-section-content');
const saveSectionBtn = document.getElementById('save-section-btn');
const mainContent = document.getElementById('main-content');

// Admin password (for simplicity, hardcoded here)
const adminPassword = 'password123';

// Open the admin login modal
adminLoginBtn.addEventListener('click', () => {
  adminLoginModal.style.display = 'flex'; // Show the login modal
});

// Close the admin login modal
closeAdminLoginBtn.addEventListener('click', () => {
  adminLoginModal.style.display = 'none'; // Hide the login modal
});

// Close the modal when clicking outside the modal content
window.addEventListener('click', (event) => {
  if (event.target === adminLoginModal) {
    adminLoginModal.style.display = 'none'; // Hide the login modal
  }
});

// Handle admin login
adminLoginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const password = document.getElementById('admin-password').value.trim();

  if (password === adminPassword) {
    alert('Login successful!');
    adminLoginModal.style.display = 'none'; // Hide the login modal
    adminDashboardModal.style.display = 'flex'; // Show the admin dashboard modal
  } else {
    alert('Invalid password. Please try again.');
  }
});

// Close the admin dashboard modal
closeAdminDashboardBtn.addEventListener('click', () => {
  adminDashboardModal.style.display = 'none'; // Hide the admin dashboard modal
});

// Show the "Add Section" form
addSectionBtn.addEventListener('click', () => {
  addSectionForm.classList.toggle('hidden');
  editSectionForm.classList.add('hidden');
});

// Show the "Edit Section" form
editSectionBtn.addEventListener('click', () => {
  editSectionForm.classList.toggle('hidden');
  addSectionForm.classList.add('hidden');

  // Populate the section dropdown
  sectionSelect.innerHTML = '';
  const sections = document.querySelectorAll('.white-box');
  sections.forEach((section, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = section.querySelector('h2').textContent;
    sectionSelect.appendChild(option);
  });

  // Load the content of the selected section
  sectionSelect.addEventListener('change', () => {
    const selectedSection = sections[sectionSelect.value];
    editSectionTitle.value = selectedSection.querySelector('h2').textContent;
    editSectionContent.value = selectedSection.querySelector('p').textContent;
  });

  // Trigger the change event to load the first section's content
  sectionSelect.dispatchEvent(new Event('change'));
});

// Handle adding a new section
newSectionForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = document.getElementById('section-title').value.trim();
  const content = document.getElementById('section-content').value.trim();

  if (title && content) {
    const newSection = document.createElement('div');
    newSection.classList.add('white-box');
    newSection.innerHTML = `<h2>${title}</h2><p>${content}</p>`;
    mainContent.appendChild(newSection);

    newSectionForm.reset();
    alert('New section added successfully!');
  } else {
    alert('Please fill out all fields.');
  }
});

// Handle saving changes to an existing section
saveSectionBtn.addEventListener('click', () => {
  const selectedSection = document.querySelectorAll('.white-box')[sectionSelect.value];
  selectedSection.querySelector('h2').textContent = editSectionTitle.value;
  selectedSection.querySelector('p').textContent = editSectionContent.value;
  alert('Section updated successfully!');
});

// Select the gambling ad modal and close button
const gamblingAd = document.getElementById('gambling-ad');
const closeGamblingAdBtn = document.getElementById('close-gambling-ad-btn');

// Show the gambling ad modal 5 seconds after the page loads
window.addEventListener('load', () => {
  setTimeout(() => {
    gamblingAd.style.display = 'flex'; // Show the gambling ad modal
  }, 5000); // 5000ms = 5 seconds
});

// Close the gambling ad modal when the close button is clicked
closeGamblingAdBtn.addEventListener('click', () => {
  gamblingAd.style.display = 'none'; // Hide the gambling ad modal
});

// Function to send log messages to the backend
function sendLogToBackend(message) {
  fetch("http://127.0.0.1:5000/log", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Log sent to backend:", data);
    })
    .catch((error) => {
      console.error("Error sending log to backend:", error);
    });
}

// Override console.log to send log messages to the backend
console.log = (function (originalLog) {
  return function (...args) {
    originalLog.apply(console, args); // Call the original console.log
    sendLogToBackend(args.join(" ")); // Send the log message to the backend
  };
})(console.log);

// Log changes to input fields
document.querySelectorAll("input, textarea").forEach((element) => {
  element.addEventListener("input", (event) => {
    const logMessage = `Input changed in element with id="${event.target.id}" to value="${event.target.value}"`;
    console.log(logMessage);
  });
});

// Log changes to contenteditable elements
document.querySelectorAll("[contenteditable='true']").forEach((element) => {
  element.addEventListener("input", (event) => {
    const logMessage = `Content changed in contenteditable element with id="${event.target.id}" to value="${event.target.innerText}"`;
    console.log(logMessage);
  });
});

// Adding new sections dynamically
document.getElementById("add-section-btn").addEventListener("click", () => {
  const sectionTitle = prompt("Enter the title of the new section:");
  const sectionContent = prompt("Enter the content of the new section:");

  if (sectionTitle && sectionContent) {
    const newSection = document.createElement("div");
    newSection.classList.add("white-box");
    newSection.innerHTML = `
      <h2 contenteditable="true">${sectionTitle}</h2>
      <p contenteditable="true">${sectionContent}</p>
    `;
    document.querySelector("main").appendChild(newSection);

    const logMessage = `New section added with title="${sectionTitle}" and content="${sectionContent}"`;
    console.log(logMessage);
  } else {
    console.log("Adding section canceled or invalid input.");
  }
});

// Editing existing sections
document.querySelectorAll(".white-box").forEach((section) => {
  section.addEventListener("input", (event) => {
    const logMessage = `Section edited: ${event.target.tagName} changed to "${event.target.innerText}"`;
    console.log(logMessage);
  });
});

// ...existing code...
function getAIResponse(msg) {
  const lower = msg.toLowerCase();

  // Länder-Infos
  const countries = {
    'italy': 'Italien ist bekannt für seine reiche Geschichte, leckere Pizza und wunderschöne Städte wie Rom, Florenz und Venedig.',
    'france': 'Frankreich bietet den Eiffelturm, köstliche Croissants und traumhafte Landschaften wie die Provence.',
    'germany': 'Deutschland ist berühmt für seine Schlösser, das Oktoberfest und Städte wie Berlin und München.',
    'japan': 'Japan begeistert mit Kirschblüten, Sushi und modernen Städten wie Tokio sowie traditionellen Tempeln.',
    'china': 'China bietet die Große Mauer, die Verbotene Stadt und eine faszinierende Kultur.',
    'thailand': 'Thailand ist bekannt für seine Strände, Tempel und das leckere Streetfood.',
    'usa': 'Die USA bieten Nationalparks, Metropolen wie New York und vielfältige Landschaften.',
    'canada': 'Kanada beeindruckt mit Naturwundern wie den Niagara Fällen und freundlichen Menschen.',
    'mexico': 'Mexiko ist berühmt für seine Maya-Ruinen, Tacos und bunte Feste.',
    'brazil': 'Brasilien lockt mit dem Karneval in Rio, dem Amazonas und traumhaften Stränden.',
    'argentina': 'Argentinien ist bekannt für Tango, Steaks und die Anden.',
    'peru': 'Peru bietet Machu Picchu, die Anden und eine spannende Geschichte.',
    'australia': 'Australien hat das Great Barrier Reef, Kängurus und die Oper von Sydney.',
    'new zealand': 'Neuseeland ist bekannt für seine atemberaubenden Landschaften und die Maori-Kultur.',
    'fiji': 'Fidschi bietet traumhafte Strände und kristallklares Wasser.',
    'egypt': 'Ägypten ist berühmt für die Pyramiden von Gizeh und den Nil.',
    'south africa': 'Südafrika bietet Safaris, Kapstadt und eine vielfältige Tierwelt.',
    'morocco': 'Marokko lockt mit bunten Märkten, Wüsten und der Stadt Marrakesch.'
  };

  // Button-Hilfen
  if (lower.includes('forum')) return 'Im Forum kannst du dich mit anderen Reisenden austauschen und Fragen stellen.';
  if (lower.includes('login')) return 'Mit dem Login-Button kannst du dich in dein Benutzerkonto einloggen.';
  if (lower.includes('register')) return 'Mit dem Register-Button kannst du ein neues Benutzerkonto anlegen.';
  if (lower.includes('profile')) return 'Im Profil findest du deine persönlichen Informationen und kannst sie bearbeiten.';
  if (lower.includes('settings')) return 'Unter Settings kannst du deine Kontoeinstellungen anpassen.';
  if (lower.includes('logout')) return 'Mit Logout meldest du dich sicher von deinem Konto ab.';
  if (lower.includes('search')) return 'Mit der Suchleiste oben kannst du gezielt nach Ländern oder Themen suchen.';

  // Länder-Antworten
  for (const country in countries) {
    if (lower.includes(country)) return countries[country];
  }

  // Standardantworten
  if (lower.includes('hallo')) return 'Hallo! Frag mich gern nach Infos zu Ländern oder wie du die Website nutzt.';
  if (lower.includes('hilfe')) return 'Ich helfe dir gern! Frag mich nach Ländern oder wie du Buttons benutzt.';
  if (lower.includes('danke')) return 'Gern geschehen! 😊';

  return 'Frag mich nach einem Land (z.B. "Erzähl mir etwas über Japan") oder wie du bestimmte Buttons nutzt!';
}
// ...existing code...

// Widget open/close
const aiBtn = document.getElementById('ai-chat-btn');
const aiWindow = document.getElementById('ai-chat-window');
const aiClose = document.getElementById('ai-close-btn');
aiBtn.onclick = () => aiWindow.classList.toggle('hidden');
aiClose.onclick = () => aiWindow.classList.add('hidden');

// Cursor animation follows input focus
const aiInput = document.getElementById('ai-chat-input');
const aiCursor = document.querySelector('.ai-cursor');
aiInput.addEventListener('focus', () => aiCursor.style.opacity = '0.7');
aiInput.addEventListener('blur', () => aiCursor.style.opacity = '0');

// Simple chat logic (simulate AI)
const aiForm = document.getElementById('ai-chat-form');
const aiMessages = document.getElementById('ai-chat-messages');
aiForm.onsubmit = function(e) {
  e.preventDefault();
  const msg = aiInput.value.trim();
  if (!msg) return;
  addMessage('user', msg);
  aiInput.value = '';
  setTimeout(() => {
    addMessage('ai', getAIResponse(msg));
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }, 700);
  aiMessages.scrollTop = aiMessages.scrollHeight;
};
function addMessage(sender, text) {
  const div = document.createElement('div');
  div.className = 'ai-message ' + sender;
  div.innerHTML = `<div class="ai-bubble">${text}</div>`;
  aiMessages.appendChild(div);
}
function getAIResponse(msg) {
  // Dummy AI: Replace with real API call if needed
  if (msg.toLowerCase().includes('hallo')) return 'Hallo! Wie kann ich dir helfen?';
  if (msg.toLowerCase().includes('reise')) return 'Erzähl mir mehr über deine Reisepläne!';
  if (msg.toLowerCase().includes('danke')) return 'Gern geschehen! 😊';
  return 'Das klingt spannend! Frag mich gern alles rund ums Reisen oder die Website.';
}