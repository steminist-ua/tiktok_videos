const cards = document.querySelectorAll(".cards__item");

cards.forEach(card => {
    card.addEventListener('click', () => {
        removingActiveClass();
        card.classList.add('cards__item--active');
    })
})

function removingActiveClass(){
    cards.forEach(card => {
        card.classList.remove('cards__item--active')
    })
}