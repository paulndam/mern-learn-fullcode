const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: `Title name is required`,
  },
  content: {
    type: String,
    required: `content is required`,
  },
  resourceUrl: {
    type: String,
    required: `resource url is required`,
  },
});

const Lesson = mongoose.model("Lesson", LessonSchema);

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: `Course name is required`,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: `category is required`,
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
  //   instructor: {
  //     type: ObjectId,
  //     ref: "User",
  //   },
  instructor: { type: mongoose.Schema.ObjectId, ref: "User" },

  published: {
    type: Boolean,
    default: false,
  },
  lessons: [LessonSchema],
});

module.exports = mongoose.model("Course", CourseSchema);
