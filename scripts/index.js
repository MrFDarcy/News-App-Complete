// Cards Animation


const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
        else {
            entry.target.classList.remove('show');
        }
    });
});


const hiddenCards = document.querySelectorAll('.hidden');
const background = document.querySelector('#frontpage');

hiddenCards.forEach(card => {
    observer.observe(card);

});




// TypeWriter animation for text in array in loop



let animatingText = document.querySelector('#aText');


const textArray = ['Business', 'Entertainment', 'Technology', 'Sports', 'Health', 'Science'];



let i = 0;
let j = 0;
let currentText = '';
let letter = '';

(function type() {
    if (i < textArray.length) {
        currentText = textArray[i];
        letter = currentText.slice(0, ++j);
        animatingText.innerHTML = letter + '<span class="cursor">|</span>';

        if (letter.length === currentText.length) {
            i++;
            j = 0;
        }

        setTimeout(type, 300);
    }
    else {
        i = 0;
        type();
    }
}());



