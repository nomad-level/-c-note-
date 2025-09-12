document.addEventListener('DOMContentLoaded', function() {
  // Theme toggle
  const themeToggle = document.getElementById('mode-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-mode');
      // Optionally swap SVG icons for sun/moon
      const icon = themeToggle.querySelector('img');
      if (icon) {
        if (document.body.classList.contains('dark-mode')) {
          icon.src = '/sun.svg';
        } else {
          icon.src = '/moon.svg';
        }
      }
    });
  }

  // Dropdown interactivity
  const padDropdownLabel = document.getElementById('padDropdownLabel');
  const padDropdownList = document.getElementById('padDropdownList');
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
    // Close dropdown if clicking outside
    document.addEventListener('click', function(e) {
      if (!padDropdownLabel.contains(e.target) && !padDropdownList.contains(e.target)) {
        padDropdownList.hidden = true;
      }
    });
  }
});
