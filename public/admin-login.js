
function login(event) {
    event.preventDefault(); // Prevent form submission

    // Get username and password input values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validate admin credentials
    if (username === 'admin@sandskyresorts.com' && password === 'admin123') {
        // Redirect to admin dashboard
        fetch('/bookingCheck', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bookingCode: username }) // Assuming username is the booking code
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to check booking');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                window.location.href = '/admin-dashboard';
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while checking booking');
        });
    } else {
        // Display error message
        alert('Invalid username or password');
    }
}
