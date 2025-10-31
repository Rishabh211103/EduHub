const { generateToken } = require('../authUtils');
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const axios = require('axios')

async function addUser(req, res) {
    try {
        const user = await User.create(req.body)
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

async function addUserV2(req, res) {
    try {
        const { userName, email, mobile, password, role } = req.body;


        if (!userName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }


        if (mobile && !/^[0-9]{10}$/.test(mobile)) {
            return res.status(400).json({ message: 'Mobile number must be 10 digits' });
        }


        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("exists already")
            return res.status(409).json({ message: 'Email already exists, Sign in with any other email' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = { userName, email, password: hashedPassword, role };
        if (mobile) {
            userData.mobile = mobile;
        }

        const newU = await User.create(userData);

        const token = generateToken(newU._id);

        res.status(200).json({
            message: 'User registered successfully',
            user: {
                id: newU._id,
                userName: newU.userName,
                email: newU.email,
                role: newU.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


async function getUserByEmailAndPassword(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Find user by email only
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.password) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
        }

        const token = generateToken(user._id);

        res.status(200).json({
            userName: user.userName,
            role: user.role,
            token,
            id: user._id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function checkEmailExits(req, res) {
    try {
        const { email } = req.body
        const isExisting = await User.findOne({ email })
        if (!isExisting) {
            return res.status(200).json({ message: 'Email do not exist', isExisting: false })
        }
        res.status(200).json({ message: 'Email already exists', isExisting: true })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function checkMobileExists(req, res) {
    try {
        const { mobile } = req.body
        const isExisting = await User.findOne({ mobile })
        console.log(isExisting)
        if (!isExisting) {
            return res.status(200).json({ message: 'Phone number do not exist', isExisting: false })
        }
        res.status(200).json({ message: 'Phone number already exists', isExisting: true })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function checkUsername(req, res) {
    try {
        const { userName } = req.body
        const isExisting = await User.findOne({ userName })
        if (!isExisting) {
            return res.status(200).json({ message: 'Username do not exist', isExisting: false })
        }
        res.status(200).json({ message: 'Username already exists', isExisting: true })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



module.exports = {
    addUser,
    addUserV2,
    checkEmailExits,
    checkMobileExists,
    getUserByEmailAndPassword,
};