import './style.css';

const htmlTag = document.documentElement;
const themeSwitchButton = document.getElementById('theme-switch');
const moonIcon = document.getElementById('moon');
const sunIcon = document.getElementById('sun');

sunIcon.style.display = 'none';

themeSwitchButton.addEventListener('click', () => {
    htmlTag.classList.toggle('dark');
    
    if (sunIcon.style.display === 'none') {
        sunIcon.style.display = '';
        moonIcon.style.display = 'none';
    }
    else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = '';
    }
});
