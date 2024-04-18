const sqlite3 = require('sqlite3').verbose();

// Create a new database file 'bookings.db'
let db = new sqlite3.Database('./bookings.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the bookings database.');
});

// SQL statement to create a 'bookings' table
db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_number TEXT NOT NULL,
    customer_first_name TEXT NOT NULL,
    customer_last_name TEXT NOT NULL,
    checkin_date TEXT NOT NULL,
    hotel_name TEXT NOT NULL DEFAULT 'SkySand Dominicus',
    room_selected TEXT NOT NULL DEFAULT 'No'
)`, (err) => {
    if (err) {
        return console.log(err.message);
    }
    console.log("Bookings table created or already exists.");
    insertBookings(); // Call the function to insert bookings
});

// Sample names - you could expand these or use an API to fetch random names
const firstNames = ["Alice", "Bob", "Charlie", "David", "Eve", "Fiona", "George", "Hannah", "Ian", "Julia"];
const lastNames = ["Johnson", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas"];

// Function to insert 50 sample bookings
function insertBookings() {
    const insertSql = `INSERT INTO bookings (booking_number, customer_first_name, customer_last_name, checkin_date, hotel_name, room_selected) VALUES (?, ?, ?, ?, ?, ?)`;
    
    for (let i = 1; i <= 50; i++) {
        // Generate sample data using random names from the lists
        const bookingNumber = `H${100000 + i}`; // H100001, H100002, ..., H100050
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const checkinDate = `2024-04-${(i % 30) + 1}`; // Cycles through days of April for variety
        const hotelName = 'SkySand Dominicus';
        const roomSelected = 'No';

        db.run(insertSql, [bookingNumber, firstName, lastName, checkinDate, hotelName, roomSelected], (err) => {
            if (err) {
                return console.error(err.message);
            }
        });
    }
    console.log("50 sample bookings have been inserted into the database.");
}

// Close the database connection
db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Closed the database connection.');
});

// Reopen the database to add columns and update entries
db = new sqlite3.Database('./bookings.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Reconnected to the bookings database for column addition and data update.');
});

// SQL statements to add new columns
const alterTableSql = `
    ALTER TABLE bookings
    ADD COLUMN room_type TEXT
`;

const alterTableSql2 = `
    ALTER TABLE bookings
    ADD COLUMN customer_email TEXT
`;

// Execute the SQL statements to add columns
db.run(alterTableSql, [], (err) => {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log('Added new column for room_type.');

    // Execute the second ALTER TABLE statement to add the customer_email column
    db.run(alterTableSql2, [], (err) => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.log('Added new column for customer_email.');

        // Now proceed to update the existing entries
        // SQL statement to update existing entries with room types and customer emails
        const updateEntriesSql = `
            UPDATE bookings
            SET room_type = CASE
                WHEN id <= 10 THEN 'Premium Room'
                WHEN id <= 20 THEN 'Junior Suite'
                WHEN id <= 30 THEN 'Junior Pool View'
                WHEN id <= 40 THEN 'Suite Ocean Front'
                ELSE 'Premium Room'
            END,
            customer_email = customer_first_name || '.' || customer_last_name || '@gmail.com'
        `;

        // Execute the SQL statement to update entries
        db.run(updateEntriesSql, [], (err) => {
            if (err) {
                console.error(err.message);
                return;
            }
            console.log('Updated existing entries with room types and customer emails.');

            // Close the database connection
            db.close((err) => {
                if (err) {
                    return console.error(err.message);
                }
                console.log('Closed the database connection.');
            });
        });
    });
});
