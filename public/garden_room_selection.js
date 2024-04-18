document.addEventListener('DOMContentLoaded', function () {
    const roomElements = document.querySelectorAll('.room-label');
    roomElements.forEach(room => {
        room.addEventListener('click', function (event) {
            event.preventDefault();
            showRoomDetails(this.dataset.roomNumber);
        });
    });

    createDummyRoomAreas();
});

const roomData = {
    121: { size: "350 sqft", amenities: ["King Bed", "Pool View", "Free WiFi", "Mini Bar", "Jacuzzi"] },
    122: { size: "340 sqft", amenities: ["Queen Bed", "Pool View", "High-Speed Internet", "Espresso Machine"] },
    123: { size: "360 sqft", amenities: ["King Bed", "Pool View", "Premium WiFi", "Spa Bath"] },
    124: { size: "320 sqft", amenities: ["Queen Bed", "Pool View", "Free WiFi", "Mini Bar"] },
    125: { size: "330 sqft", amenities: ["King Bed", "Pool View", "Free WiFi", "Luxury Bath Amenities"] },
    126: { size: "310 sqft", amenities: ["Two Twin Beds", "Pool View", "Free WiFi", "Work Desk"] },
    127: { size: "300 sqft", amenities: ["Queen Bed", "Garden View", "Smart TV", "Coffee Maker"] },
    128: { size: "300 sqft", amenities: ["King Bed", "Garden View", "Free WiFi", "Mini Fridge"] },
    129: { size: "290 sqft", amenities: ["Queen Bed", "Garden View", "Free WiFi", "In-room Safe"] },
    130: { size: "280 sqft", amenities: ["Two Twin Beds", "Garden View", "Free WiFi", "Desk"] },
    131: { size: "350 sqft", amenities: ["King Bed", "Garden View", "Free WiFi", "Sitting Area"] },
    132: { size: "340 sqft", amenities: ["Queen Bed", "Garden View", "Free WiFi", "Balcony"] },
    133: { size: "360 sqft", amenities: ["King Bed", "Garden View", "Free WiFi", "Large Bathtub"] },
    134: { size: "320 sqft", amenities: ["Queen Bed", "Garden View", "Free WiFi", "Luxury Robes"] },
    135: { size: "330 sqft", amenities: ["King Bed", "Garden View", "High-Speed Internet", "Minibar"] },
    136: { size: "310 sqft", amenities: ["Two Twin Beds", "Garden View", "Free WiFi", "Beverage Station"] },

};

function createDummyRoomAreas() {
    const mapContainer = document.querySelector('.room-selection-container');
    const numberOfRows = 3; // Two rows of rooms
    const roomsPerRow = 7; // 10 rooms per row

    for (let i = 0; i < 21; i++) {
        const roomNumber = 121 + i;
        const roomArea = document.createElement('div');
        roomArea.className = 'room-label';
        roomArea.textContent = 'Room ' + roomNumber;
        roomArea.dataset.roomNumber = roomNumber;
        roomArea.style.position = 'absolute';
        const row = Math.floor(i / roomsPerRow);
        const column = i % roomsPerRow;
        roomArea.style.top = `${row * 10 + 85}%`;
        roomArea.style.left = `${(column * 10) + 8}%`;
        roomArea.style.cursor = 'pointer';
        roomArea.style.padding = '5px';
        roomArea.style.backgroundColor = 'rgba(255, 255, 255)';
        roomArea.style.borderRadius = '5px';

        roomArea.addEventListener('click', function (event) {
            showRoomDetails(this.dataset.roomNumber);
        });

        mapContainer.appendChild(roomArea);
    }
}

function showRoomDetails(roomNumber) {
    const roomDetails = document.getElementById('room-details');
    const data = roomData[roomNumber];
    roomDetails.innerHTML = `
        <h2>Room ${roomNumber}</h2>
        <p>Size: ${data.size}</p>
        <p>Amenities: ${data.amenities.join(", ")}</p>
        <div id="carousel" class="carousel"></div>
        <button onclick="bookRoom('${roomNumber}')">Select this room</button>
        <button onclick="hideRoomDetails()">Back</button>  <!-- Back button -->
    `;
    setupCarousel();
    roomDetails.style.display = 'block';
}
function hideRoomDetails() {
    const roomDetails = document.getElementById('room-details');
    roomDetails.style.display = 'none';
}

function setupCarousel() {
    const carousel = document.getElementById('carousel');
    carousel.innerHTML = ''; // Clear previous images
    const imageFilenames = ['image (3).avif', 'image (4).avif', 'image (5).avif', 'image (6).avif', 'image (7).avif']; // Universal images

    imageFilenames.forEach((filename, index) => {
        const img = document.createElement('img');
        img.src = `./images/${filename}`;
        img.alt = `Feature Image ${index + 1}`;
        img.classList.add('carousel-img');
        if (index === 0) {
            img.classList.add('active'); // Make the first image active
        }
        carousel.appendChild(img);
    });

    startCarousel();
}

function startCarousel() {
    let index = 0;
    const images = document.querySelectorAll('.carousel-img');
    setInterval(() => {
        images[index].classList.remove('active');
        index = (index + 1) % images.length;
        images[index].classList.add('active');
    }, 3000); // Change images every 3000 milliseconds
}

function bookRoom(roomNumber) {
    updateRoomStatus(roomNumber);
}

function updateRoomStatus(roomNumber) {
    const urlParams = new URLSearchParams(window.location.search);
    const bookingNumber = urlParams.get('bookingNumber');
    const checkInDate = urlParams.get('checkInDate');
    fetch('/book-room', {  // Example endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomNumber: roomNumber, bookingNumber, checkInDate })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const roomDetails = document.getElementById('room-details');
                roomDetails.style.display = 'none';
                const bookedRoomElement = document.querySelector(`div[data-room-number="${roomNumber}"]`);
                if (bookedRoomElement) {
                    bookedRoomElement.style.backgroundColor = 'red'; // Indicate the room is booked
                }
                alert(`Room ${roomNumber} booked! You should be receiving an email shortly with the confirmation.`);
                setTimeout(() => {
                    window.location.href = '/'; // Redirect to home
                }, 1000);
            } else {
                alert('Failed to book the room. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error booking the room:', error);
            alert('Error processing your request. Please try again.');
        });
}