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