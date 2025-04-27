document.addEventListener('DOMContentLoaded', function() {
    const menuCheckbox = document.querySelector('.menus');
    const animatefonElement = document.querySelector('.animatefon');
    const animatefonallElement = document.querySelector('.animatefonall');

    menuCheckbox.addEventListener('change', function() {
        if (this.checked) {
            animatefonallElement.style.transform = 'translateX(290px) translateY(0px)';
        } else {
            animatefonallElement.style.transform = 'translateX(0px) translateY(0px)';
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const lightnCheckbox = document.querySelector('.lightn');
    const canvas = document.getElementById('canvas');
    
    lightnCheckbox.addEventListener('change', function() {
        if (this.checked) {
            canvas.style.display = 'none';
        } else {
            canvas.style.display = 'block';
        }
    });
});