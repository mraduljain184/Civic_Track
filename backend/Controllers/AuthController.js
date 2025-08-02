const bcrypt = require('bcrypt');
const UserModel = require('../Models/User');

const jwt = require('jsonwebtoken');
const signup = async (req, res) => {
    try {
        const { username, phone, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({ username, phone, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, username: user.username });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
}
module.exports = {
  signup,
  login
};


