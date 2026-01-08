const themeSwitchButton = document.getElementById('theme-switch');
const moonIcon = document.getElementById('moon');
const sunIcon = document.getElementById('sun');
const htmlTag = document.documentElement;

themeSwitchButton.addEventListener('click', () => {
  
    htmlTag.classList.toggle('dark');

    moonIcon.classList.toggle('hidden');
    sunIcon.classList.toggle('hidden');
});
