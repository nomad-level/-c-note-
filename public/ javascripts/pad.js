// ==== DARK/LIGHT MODE TOGGLE ====
const body = document.body;
const modeToggle = document.getElementById('mode-toggle');
const moonIcon = document.querySelector('.pad-moon-icon');

function setMode(isDark) {
  if (isDark) {
    body.classList.add('dark-mode');
    if (moonIcon) moonIcon.src = '/sun.svg';
    localStorage.setItem('pad-theme', 'dark');
  } else {
    body.classList.remove('dark-mode');
    if (moonIcon) moonIcon.src = '/moon.svg';
    localStorage.setItem('pad-theme', 'light');
  }
}

(function initTheme() {
  const ls = localStorage.getItem('pad-theme');
  setMode(ls === 'dark' || (!ls && window.matchMedia('(prefers-color-scheme: dark)').matches));
})();

if (modeToggle) {
  modeToggle.addEventListener('click', function() {
    setMode(!body.classList.contains('dark-mode'));
  });
}

// ==== PAD DROPDOWN INTERACTIVITY ====
const padDropdownLabel = document.getElementById('padDropdownLabel');
const padDropdownList = document.getElementById('padDropdownList');

if (padDropdownLabel && padDropdownList) {
  padDropdownLabel.addEventListener('click', () => {
    padDropdownList.hidden = !padDropdownList.hidden;
  });

  // Close dropdown if clicking outside
  document.addEventListener('click', (e) => {
    if (!padDropdownLabel.contains(e.target) && !padDropdownList.contains(e.target)) {
      padDropdownList.hidden = true;
    }
  });

  // Tag expand/collapse and title loading
  padDropdownList.addEventListener('click', function(e) {
    const tagItem = e.target.closest('.pad-tag-item');
    if (tagItem) {
      // Toggle show/hide titles for this tag
      const titlesList = tagItem.querySelector('.pad-titles-list');
      if (titlesList) {
        titlesList.hidden = !titlesList.hidden;
      }
    }
    const titleItem = e.target.closest('.pad-title-item');
    if (titleItem) {
      const tagItem = titleItem.closest('.pad-tag-item');
      const tagName = tagItem?.dataset.tag;
      const noteTitle = titleItem.dataset.title;
      // Fire AJAX or page reload here to load note, or set form values (demo below)
      fetch(`/notes/get?tag=${encodeURIComponent(tagName)}&title=${encodeURIComponent(noteTitle)}`)
        .then(res => res.json())
        .then(note => {
          document.getElementById('note-tag').value = note.tag;
          document.getElementById('note-title').value = note.title;
          document.getElementById('note-content').value = note.content;
        });
      padDropdownList.hidden = true;
    }
  });
}

// ==== AUTO-RESET FORM ON SAVE ====
const padForm = document.getElementById('pad-form');
if (padForm) {
  padForm.addEventListener('submit', function(e) {
    // Optionally make this AJAX for a SPA feel
    setTimeout(() => {
      padForm.reset();
      document.getElementById('note-tag').focus();
    }, 250);
  });
}