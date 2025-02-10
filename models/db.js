const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true},
  creatorId: { type: mongoose.Schema.Types.ObjectId, required: true }
});

const purchaseSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const catergoriesSchema = new mongoose.Schema({
  title:{type: String, required: true},
  description: {type: String, required:true},
  image: {type: String, required:true}
});


const userModel = mongoose.model("User", userSchema); 
const courseModel = mongoose.model("Course", courseSchema);
const purchaseModel = mongoose.model("Purchase", purchaseSchema);
const catergoriesModel = mongoose.model("Categories", catergoriesSchema);

const db = "mongodb+srv://nitinkapoor117:PRAJWa67IbBncLHG@test-db.rwlyl.mongodb.net/garv-db"

mongoose.connect(db).then(() => console.log("DB connected")).catch((err)=> console.log(err));

module.exports = { userModel, courseModel, purchaseModel, catergoriesModel };