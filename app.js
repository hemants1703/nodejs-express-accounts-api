const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

const users = [];

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/register', (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the username or email is already taken
        if (users.some(user => user.username === username) || users.some(user => user.email === email))
            return res.status(400).json({ message: 'Username or email already exists' });

        // Save the user in the database (replace with database logic)
        users.push({ username, email, password });

        console.log(users);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;

        const user = users.find(user => user.username === username);

        if (!user || user.password !== password)
            return res.status(401).json({ message: 'Invalid credentials' });

        res.json({ message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/forgot-password', (req, res) => {
    // Implement password reset logic here (e.g., send a reset email)

    const { email, old_password, new_password } = req.body;

    const user = users.find(user => user.email === email);

    if(!user)
        return res.status(404).json({ message: 'User not found' });

    if(old_password !== user.password)
        return res.status(401).json({ message: 'Invalid credentials' });

    user.password = new_password;
    res.status(200).json({ message: 'Password reset successful' });
});

app.listen(PORT, () => console.log("Server is running on port 3000"));