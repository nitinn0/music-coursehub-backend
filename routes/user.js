const express = require('express');
const router = express.Router();
const {userModel} = require('../models/db');
const bcrypt = require('bcrypt');
const verifyToken = require('../middlewares/verifyToken');
const jwt = require('jsonwebtoken');

router.post('/register', async(req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({ username, email, password: hashedPassword });
        await user.save();
        
        
        res.status(200).json({ msg: "User Registered!" });
    } catch (error) {
        res.status(500).json({ error: "Registration failed due to a server error." });
    }
});


router.post('/login', async(req, res) => {
    try{
        const { username, password} = req.body;
        const user = await userModel.findOne({username});
        if(!user){
            res.status(401).json({error : "Authentication Failed"});
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            res.status(401).json({error : "Wrong password"});
        }
        const token = jwt.sign({ userId: user._id}, 'secret-key', {
            expiresIn : '1h',
        });
        res.status(200).json({token});
    } catch(error){
        res.status(500).json({error : "Login Failed"});
    }
});

router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ name: user.name, email: user.email, phone: user.phone });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});


module.exports = router;