const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

const user = require('./routes/user');
const protectedRoute = require('./routes/protectedRoute');
const courseRouter = require('./routes/courseRouter');
const admin = require('./routes/admin');
const contact = require('./routes/contact');

app.use(express.json());
app.use(cors());

const db = "mongodb+srv://nitinkapoor117:PRAJWa67IbBncLHG@test-db.rwlyl.mongodb.net/garv-db"

mongoose.connect(db).then(() => console.log("DB connected")).catch((err)=> console.log(err));


app.use('/user', user);
app.use('/admin', admin);
app.use('/protected', protectedRoute);
app.use('/course', courseRouter);
app.use('/contact', contact);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
