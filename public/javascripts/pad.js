document.addEventListener('DOMContentLoaded', function() {
  // === DARK MODE FEATURE ===
  // This section enables dark mode for the app and remembers the user's preference.

  // Get the dark mode toggle button (the moon/sun icon in the header)
  const themeToggle = document.getElementById('mode-toggle');

  // Helper function to set the theme (dark or light)
  // 'dark' is a boolean: true for dark mode, false for light mode
  const setTheme = (dark) => {
    if (dark) {
      // Add the 'dark-mode' class to the body (and html via inline script)
      document.body.classList.add('dark-mode');
      // Change the icon to a sun when in dark mode
      if (themeToggle) {
        const icon = themeToggle.querySelector('img');
        if (icon) icon.src = '/sun.svg';
      }
    } else {
      // Remove the 'dark-mode' class for light mode
      document.body.classList.remove('dark-mode');
      // Change the icon to a moon when in light mode
      if (themeToggle) {
        const icon = themeToggle.querySelector('img');
        if (icon) icon.src = '/moon.svg';
      }
    }
  };

  // On page load, check if the user previously chose dark mode (saved in localStorage)
  // If so, enable dark mode right away
  setTheme(localStorage.getItem('padDarkMode') === 'true');

  // When the user clicks the toggle button, switch between dark and light mode
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      // Toggle the mode: if currently dark, switch to light, and vice versa
      const dark = !document.body.classList.contains('dark-mode');
      setTheme(dark);
      // Save the user's preference in localStorage so it stays after reload
      localStorage.setItem('padDarkMode', dark);
    });
  }

  // Dropdown interactivity
  const padDropdownLabel = document.getElementById('padDropdownLabel');
  const padDropdownList = document.getElementById('padDropdownList');
  const padDeleteForm = document.getElementById('pad-delete-form');
  const padForm = document.getElementById('pad-form');

  if (padDropdownLabel && padDropdownList) {
    padDropdownLabel.addEventListener('click', function(e) {
      padDropdownList.hidden = !padDropdownList.hidden;
      e.stopPropagation();
    });
    // Expand/collapse tag titles
    padDropdownList.addEventListener('click', function(e) {
      const tagLabel = e.target.closest('.pad-tag-label');
      if (tagLabel) {
        const tagItem = tagLabel.parentElement;
        const titlesList = tagItem.querySelector('.pad-titles-list');
        if (titlesList) {
          titlesList.hidden = !titlesList.hidden;
        }
        e.stopPropagation();
        return;
      }
      const titleItem = e.target.closest('.pad-title-item');
      if (titleItem) {
        const noteId = titleItem.dataset.id;
        // Fetch note data from backend and fill the form
        fetch(`/notes/get?id=${encodeURIComponent(noteId)}`)
          .then(res => {
            if (!res.ok) throw new Error('Note not found');
            return res.json();
          })
          .then(note => {
            document.getElementById('note-category').value = note.category;
            document.getElementById('note-title').value = note.title;
            document.getElementById('note-body').value = note.body;
            // Set delete form action to this note's delete URL
            if (padDeleteForm) padDeleteForm.action = `/notes/${noteId}?_method=DELETE`;
          })
          .catch(err => {
            alert('Could not load note: ' + err.message);
            console.error('Note fetch error:', err);
          });
        padDropdownList.hidden = true;
        e.stopPropagation();
        return;
      }
    });
    // When creating a new note, clear the delete form action
    if (padForm && padDeleteForm) {
      padForm.addEventListener('reset', function() {
        padDeleteForm.action = '';
      });
    }
    // Close dropdown if clicking outside
    document.addEventListener('click', function(e) {
      if (!padDropdownLabel.contains(e.target) && !padDropdownList.contains(e.target)) {
        padDropdownList.hidden = true;
      }
    });
  }
});
