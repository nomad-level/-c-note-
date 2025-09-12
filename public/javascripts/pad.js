document.addEventListener('DOMContentLoaded', function() {
  // Theme toggle with localStorage persistence
  const themeToggle = document.getElementById('mode-toggle');
  const setTheme = (dark) => {
    if (dark) {
      document.body.classList.add('dark-mode');
      if (themeToggle) {
        const icon = themeToggle.querySelector('img');
        if (icon) icon.src = '/sun.svg';
      }
    } else {
      document.body.classList.remove('dark-mode');
      if (themeToggle) {
        const icon = themeToggle.querySelector('img');
        if (icon) icon.src = '/moon.svg';
      }
    }
  };
  // On load, set theme from localStorage
  setTheme(localStorage.getItem('padDarkMode') === 'true');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const dark = !document.body.classList.contains('dark-mode');
      setTheme(dark);
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
