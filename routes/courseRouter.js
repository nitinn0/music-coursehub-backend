const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const verifyAdmin = require('../middlewares/verifyAdmin');
const verifyToken = require('../middlewares/verifyToken');
const { userModel, courseModel, purchaseModel, catergoriesModel } = require('../models/db'); 
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nitinkapoor117@gmail.com",
    pass: "vwsu fyyk stta qslx", 
  },
});
     
router.post('/addCourse', verifyAdmin, async (req, res) => {
    const { title, description, price, imageUrl, creatorId } = req.body;

    if (!title || !description || !price || !imageUrl || !creatorId) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const newCourse = new courseModel({ title, description, price, imageUrl, creatorId });
        await newCourse.save();
        res.status(201).json({ msg: 'Course Added!', course: newCourse });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});


router.delete('/deleteCourse/:id', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCourse = await courseModel.findByIdAndDelete(id);
        if (!deletedCourse) {
            return res.status(404).json({ error: 'No course found!' });
        }
        res.status(200).json({ msg: 'Course Deleted!' });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

router.post('/addCategories', verifyAdmin, async(req, res) => {
    try{
    const {title, description} = req.body;
    if(!title || !description){
        return res.status(400).json({error : "All Fields req.."});
    }
    const newCatergory = new catergoriesModel({title, description});
    await newCatergory.save();

    res.status(201).json({ msg: "Category created successfully", category: newCatergory});
} catch(error){
    res.status(500).json({ error: 'Server Error', error});
}
});

router.get('/getCategories', async (req, res) => {
    try {
        const categories = await catergoriesModel.find(); // Fetch all categories
        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

router.get('/availableCourses', async (req, res) => {
    try {
        const availableCourses = await courseModel.find();
        if (availableCourses.length === 0) {
            return res.status(404).json({ error: "No courses found" });
        }
        res.status(200).json({ availableCourses });
    } catch (error) {
        res.status(500).json({ error: "Server Error!", details: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const course = await courseModel.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ msg: "Course not found" });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ error: "Server Error!", details: error.message });
    }
});

router.post('/buy', verifyToken, async (req, res) => {
    const { courseId, userDetails } = req.body;
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

        if (!userDetails || !userDetails.email) {
            return res.status(400).json({ error: "User email is required for sending mail." });
        }

        const mailOptions = {
            from: "nitinkapoor117@gmail.com",
            to: userDetails.email,
            subject: `Course Enrollment Confirmation: ${course.title}`,
            html: `
              <h2>Enrollment Successful!</h2>
              <p><b>Name:</b> ${userDetails.name}</p>
              <p><b>Phone:</b> ${userDetails.phone}</p>
              <p><b>Course:</b> ${course.title}</p>
              <p>🔗 <a href="https://i.ibb.co/1dLhTDm/doge.webp" target="_blank">Access your Course</a></p>
              <p>Thank you for enrolling with us!</p>
            `,
        };

        console.log("Sending email to:", userDetails.email);

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("Error sending email:", err);
                return res.status(500).json({ error: "Email sending failed", details: err.message });
            } else {
                console.log("Email sent successfully:", info.response);
                return res.status(200).json({ msg: "Course Purchased Successfully! Confirmation email sent." });
            }
        });

    } catch (error) {
        console.error("Server Error:", error.message);
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
        res.status(500).json({ error: "Server Error", details: error.message });
    }
});

module.exports = router;
