// Dropdown logic for landing page
document.addEventListener("DOMContentLoaded", () => {
  const signupBtn = document.getElementById("signup-btn");
  const loginBtn = document.getElementById("login-btn");
  const signupDropdown = document.getElementById("signup-dropdown");
  const loginDropdown = document.getElementById("login-dropdown");
  let openDropdown = null;

  function closeDropdowns() {
    [signupDropdown, loginDropdown].forEach(d => {
      d.classList.remove("show");
    });
    openDropdown = null;
  }

  // Button click handlers
  signupBtn.addEventListener("click", e => {
    e.stopPropagation();
    if (openDropdown === signupDropdown) {
      closeDropdowns();
    } else {
      closeDropdowns();
      signupDropdown.classList.add("show");
      openDropdown = signupDropdown;
    }
  });

  loginBtn.addEventListener("click", e => {
    e.stopPropagation();
    if (openDropdown === loginDropdown) {
      closeDropdowns();
    } else {
      closeDropdowns();
      loginDropdown.classList.add("show");
      openDropdown = loginDropdown;
    }
  });

  // Prevent click inside dropdown from closing
  [signupDropdown, loginDropdown].forEach(dropdown => {
    dropdown.addEventListener("click", e => {
      e.stopPropagation();
    });
  });

  // Click outside closes dropdown
  document.addEventListener("click", () => {
    closeDropdowns();
  });

  // Escape key closes dropdown
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDropdowns();
    }
  });
});