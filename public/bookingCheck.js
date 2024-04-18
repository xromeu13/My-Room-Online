document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.querySelector('.room-selection-form form');
    const customDialog = document.getElementById('custom-dialog');
    const okButton = document.getElementById('dialog-ok-button');
    const dialogMessage = document.getElementById('dialog-message');

    // Function to show dialog with message
    function showDialog(message) {
        dialogMessage.textContent = message;
        customDialog.style.display = 'flex'; // Ensure this matches your CSS for displaying the dialog
    }

    // Function to close dialog
    function closeDialog() {
        customDialog.style.display = 'none';
    }

    okButton.addEventListener('click', closeDialog);

    bookingForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(bookingForm);
        fetch('/check-booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(formData))
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => Promise.reject(data.message));
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                window.location.href = data.redirect;
            } else {
                showDialog(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showDialog('Booking not found, please check your voucher.');
        });
    });
});
