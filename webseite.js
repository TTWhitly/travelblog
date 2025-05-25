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

