// Function to save a comment to localStorage
function saveComment(name, text) {
  const savedComments = JSON.parse(localStorage.getItem('comments')) || [];
  savedComments.push({ name, text });
  localStorage.setItem('comments', JSON.stringify(savedComments));
}

// Function to add a comment to the DOM
function addCommentToDOM(name, text) {
  const commentElement = document.createElement('div');
  commentElement.classList.add('comment');
  commentElement.innerHTML = `
    <strong>${name}</strong>
    <p>${text}</p>
  `;
  commentList.appendChild(commentElement);
}

// Function to load all comments from localStorage and display them
function loadComments() {
  const savedComments = JSON.parse(localStorage.getItem('comments')) || [];
  savedComments.forEach((comment) => {
    addCommentToDOM(comment.name, comment.text);
  });
}

// Select the comment form and list
const commentForm = document.getElementById('comment-form');
const commentList = document.getElementById('comments-list');

// Handle comment form submission
commentForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const nameInput = document.getElementById('name');
  const commentInput = document.getElementById('comment');

  const name = nameInput.value.trim();
  const text = commentInput.value.trim();

  if (name && text) {
    saveComment(name, text); // Save the comment to localStorage
    addCommentToDOM(name, text); // Add the comment to the DOM
    commentForm.reset(); // Clear the form
  } else {
    alert('Please fill out both fields.');
  }
});

// Load comments on page load
document.addEventListener('DOMContentLoaded', () => {
  loadComments();

  // Check for saved dark mode preference in localStorage
  if (localStorage.getItem('darkMode') === 'enabled') {
    enableDarkMode();
  }
});

// Select the dark mode toggle button
const darkModeToggle = document.getElementById('dark-mode-toggle');

// Toggle dark mode on button click
darkModeToggle.addEventListener('click', () => {
  if (document.body.classList.contains('dark-mode')) {
    disableDarkMode();
  } else {
    enableDarkMode();
  }
});

// Enable dark mode
function enableDarkMode() {
  document.body.classList.add('dark-mode');
  localStorage.setItem('darkMode', 'enabled');
  darkModeToggle.textContent = '☀️ Light Mode';
}

// Disable dark mode
function disableDarkMode() {
  document.body.classList.remove('dark-mode');
  localStorage.setItem('darkMode', 'disabled');
  darkModeToggle.textContent = '🌙 Dark Mode';
}