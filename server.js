const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');  // Add CORS support

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS
app.use(express.static('public')); // Serve static files from 'public' directory
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let db = new sqlite3.Database('./bookings.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error opening database: ' + err.message);
        process.exit(1);  // Stop the application if the database connection fails
    }
    console.log('Connected to the bookings database.');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'my_room_online.html'));
});

app.post('/bookingCheck', (req, res) => {
    const { bookingCode, checkInDate } = req.body;
    if (!bookingCode) {
        return res.status(400).json({ status: 'error', message: 'Booking code is required.' });
    }
    db.get('SELECT * FROM bookings WHERE booking_number = ? AND checkin_date = ?', [bookingCode, checkInDate], (err, row) => {
        if (err) {
            res.status(500).json({ status: 'error', message: 'An error occurred during the database query.' });
            return console.error(err.message);
        }
        if (row) {
            res.json({ status: 'success', redirect: '/room_selection.html?bookingCode=' + bookingCode });
        } else {
            res.status(404).json({ status: 'error', message: 'Booking not found, please check your voucher.' });
        }
    });
});

app.get('/admin-dashboard', (req, res) => {
    db.all('SELECT * FROM bookings', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ status: 'error', message: 'Failed to fetch data from the database.' });
            return;
        }
        res.json(rows);
    });
});

app.get('/get-booking', (req, res) => {
    const { bookingNumber, checkInDate } = req.query;
    if (!bookingNumber) {
        return res.status(400).json({ status: 'error', message: 'Booking number is required.' });
    }
    db.get('SELECT * FROM bookings WHERE booking_number = ? AND checkin_date = ?', [bookingNumber, checkInDate], (err, row) => {
        if (err) {
            res.status(500).json({ status: 'error', message: 'An error occurred during the database query.' });
            return console.error(err.message);
        }
        if (row) {
            res.json({ status: 'success', booking: row });
        } else {
            res.status(404).json({ status: 'error', message: 'Booking not found.' });
        }
    });
});

app.post('/book-room', (req, res) => {
    const { roomNumber, bookingNumber, checkInDate } = req.body;
    if (!bookingNumber) {
        return res.status(400).json({ status: 'error', message: 'Booking code is required.' });
    }
    db.run('UPDATE bookings SET room_selected = ? WHERE booking_number = ? AND checkin_date = ?', ['Yes', bookingNumber, checkInDate], (err) => {
        if (err) {
            console.error('Error updating room_selected:', err.message);
            return;
        }
        res.status(200).json({ success: true });
        console.log(`Room selection updated to 'Yes' for booking number ${bookingNumber}`);
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});