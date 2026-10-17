(function () {
    [...document.querySelectorAll(".control")].forEach(button => {
        button.addEventListener("click", function() {
            document.querySelector(".active-btn").classList.remove("active-btn");
            this.classList.add("active-btn");
            document.querySelector(".active").classList.remove("active");
            document.getElementById(button.dataset.id).classList.add("active");
        })
    });
    document.querySelector(".theme-btn").addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
    })
})();

// Custom validation message for the contact form email field
(function () {
    var email = document.querySelector('.contact-form input[name="email"]');
    if (!email) return;
    email.addEventListener("invalid", function () {
        email.setCustomValidity("Enter a valid email address");
    });
    email.addEventListener("input", function () {
        email.setCustomValidity("");
    });
})();

// Submit the contact form in the background so visitors stay on the page
(function () {
    var form = document.querySelector('.contact-form');
    if (!form) return;
    var successBox = document.querySelector('.form-success');
    var sendAnother = document.querySelector('.form-success .send-another');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        var data = {
            name: form.querySelector('[name="name"]').value,
            email: form.querySelector('[name="email"]').value,
            subject: form.querySelector('[name="subject"]').value,
            message: form.querySelector('[name="message"]').value,
            _subject: 'New message from your portfolio',
            _captcha: 'false',
            _honey: ''
        };
        fetch('https://formsubmit.co/ajax/prayushsthapit2@gmail.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(function (response) {
            if (!response.ok) throw new Error('send failed');
            return response.json();
        })
        .then(function () {
            form.hidden = true;
            if (successBox) {
                successBox.hidden = false;
                successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            form.reset();
        })
        .catch(function () {
            alert('Something went wrong sending your message. Please try again.');
        });
    });

    if (sendAnother) {
        sendAnother.addEventListener('click', function () {
            if (successBox) successBox.hidden = true;
            form.hidden = false;
        });
    }
})();

// Make entire portfolio cards clickable (not just the small GitHub icon)
document.querySelectorAll('.portfolio-item').forEach(function (card) {
    var link = card.querySelector('.hover-items .icons a');
    if (!link) return;
    card.style.cursor = 'pointer';
    card.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        window.open(link.href, '_blank');
    });
});
