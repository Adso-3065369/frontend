/**
 * @file HelpController.js
 */

export const HelpController = () => {

    const buttons = document.querySelectorAll('.faq-btn');

    buttons.forEach(button => {

        button.addEventListener('click', () => {

            const content = button.nextElementSibling;

            const icon = button.querySelector('i');

            content.classList.toggle('hidden');

            icon.classList.toggle('ri-arrow-down-s-line');
            icon.classList.toggle('ri-arrow-up-s-line');

        });

    });

};