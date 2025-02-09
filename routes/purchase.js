const express = require('express');
const router = express.Router();
const { userModel, courseModel, purchaseModel } = require('../models/db');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/verifyToken');

router.post('/buy', verifyToken, async (req, res) => {
    const { courseId } = req.body;
    const userId = req.user?.userId; 

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: User ID not found in token" });
    }

    try {
        const course = await courseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course Not Found" });
        }

        const existingPurchase = await purchaseModel.findOne({ userId, courseId });
        if (existingPurchase) {
            return res.status(400).json({ error: "You have already purchased this course!" });
        }

        const purchase = new purchaseModel({ userId, courseId });
        await purchase.save();

        res.status(200).json({ msg: "Course Purchased Successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Server Error", details: error.message });
    }
});


router.get('/my-courses', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const purchases = await purchaseModel.find({ userId }).populate('courseId');
        if (purchases.length === 0) {
            return res.status(404).json({ error: "No purchased courses found!" });
        }

        res.status(200).json({ purchasedCourses: purchases.map(p => p.courseId) });
    } catch (error) {
        res.status(500).json({ error: "Server Error", details: error });
    }
});

module.exports = router;
