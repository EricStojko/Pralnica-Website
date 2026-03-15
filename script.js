document.addEventListener('DOMContentLoaded', () => {
    // Esc key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // FAQ Accordion Logic
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const content = question.nextElementSibling;
            const isActive = question.classList.contains('active');

            // Close all other open FAQs
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question && otherQuestion.classList.contains('active')) {
                    otherQuestion.classList.remove('active');
                    otherQuestion.nextElementSibling.style.maxHeight = null;
                }
            });

            // Toggle current FAQ
            question.classList.toggle('active');
            if (!isActive) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });
    // Phone obfuscation logic removed - explicit display requested
});

function openModal(element) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalBadge = document.getElementById('modalBadge');
    const modalHint = document.getElementById('modalHint');
    const modalBtn = document.getElementById('modalBtn');
    const modalCaption = document.getElementById('modalOverlay');
    const modalTip = document.getElementById('modalTip');

    const imageSrc = element.getAttribute('data-image');
    const icon = element.getAttribute('data-icon');
    const hint = element.getAttribute('data-hint');
    const link = element.getAttribute('data-link');
    const caption = element.getAttribute('data-caption');
    const tip = element.getAttribute('data-tip');

    if (imageSrc) modalImg.src = imageSrc;
    if (icon && modalBadge) modalBadge.innerText = icon;
    if (hint && modalHint) modalHint.innerText = hint;
    if (link && modalBtn) modalBtn.href = link;
    if (caption && modalCaption) modalCaption.innerText = caption;

    if (modalTip) {
        if (tip) {
            modalTip.innerText = tip;
            modalTip.style.display = 'block';
        } else {
            modalTip.style.display = 'none';
        }
    }

    modal.style.display = "flex";
    document.body.style.overflow = "hidden"; // Prevent scrolling
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = "none";
    document.body.style.overflow = ""; // Restore scrolling
}
