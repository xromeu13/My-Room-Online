console.log('Script file is linked.');
function increment() {
    var adultsInput = document.getElementById('adults');
    adultsInput.value = parseInt(adultsInput.value, 10) + 1;
}

function decrement() {
    var adultsInput = document.getElementById('adults');
    var currentValue = parseInt(adultsInput.value, 10);
    if (currentValue > 1) {
        adultsInput.value = currentValue - 1;
    }
}

// Add additional JavaScript code here for more functionality
