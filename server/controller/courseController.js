const Course = require("../model/courseModel");
const formidable = require("formidable");
const fs = require("fs");
const extend = require("lodash/extend");
const errorHandler = require("../helpers/dbErrorHandler");
const defaultProfileImg = "";

const create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    let course = new Course(fields);
    course.instructor = req.profile;
    if (files.image) {
      course.image.data = fs.readFileSync(files.image.filepath);
      course.image.contentType = files.image.type;
    }
    try {
      let result = await course.save();
      res.json(result);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
};

const courseByID = async (req, res, next, id) => {
  try {
    let course = await Course.findById(id).populate("instructor", "_id name");
    if (!course) {
      return res.status(404).json({
        error: `Can't find course with that ID`,
      });
    }
    req.course = course;
    next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: `Can't get course by ID`,
    });
  }
};

const read = (req, res) => {
  req.course.image = undefined;
  return res.json(req.course);
};

const list = async (req, res) => {
  try {
    let courses = await Course.find().select("name email updated created");
    console.log(courses);
    res.json(courses);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const update = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: `Can't uplaod or read image `,
      });
    }

    let course = req.course;
    course = extend(course, fields);

    if (fields.lessons) {
      course.lessons = JSON.parse(fields.lessons);
    }

    course.updated = Date.now();

    if (files.image) {
      course.image.data = fs.readFileSync(files.image.filepath);
      course.image.contentType = files.image.type;
    }

    try {
      await course.save();
      res.json(course);
    } catch (err) {
      console.log(`---Failed updating course-----`);
      console.log(err);
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
};

const newLesson = async (req, res) => {
  try {
    let lesson = req.body.lesson;
    let result = await Course.findByIdAndUpdate(
      req.course._id,
      { $push: { lessons: lesson }, updated: Date.now() },
      { new: true }
    )
      .populate("instructor", "_id name")
      .exec();

    console.log(result);
    res.json(result);
  } catch (err) {
    console.log(`---Failed to add new lesson-----`);
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const remove = async (req, res) => {
  try {
    let course = req.course;
    let deleteCourse = await course.remove();
    res.json(deleteCourse);
  } catch (err) {
    console.log(`---Failed to remove course-----`);
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const isInstructor = (req, res, next) => {
  const isInstructor =
    req.course && req.auth && req.course.instructor._id == req.auth._id;
  if (!isInstructor) {
    return res.status(403).json({
      error: `User is unauthorized`,
    });
  }
  next();
};

const listByInstructor = (req, res) => {
  Course.find({ instructor: req.profile._id }, (err, courses) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
    console.log(`--- list of instructors and their courses---`);
    // console.log(courses);
    res.json(courses);
  }).populate("instructor", "_id name");
};

const listPublished = (req, res) => {
  Course.find({ published: true }, (err, courses) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
    console.log(`--- list of courses by Instructor ---`);
    // console.log(courses);
    res.json(courses);
  }).populate("instructor", "_id name");
};

const photo = (req, res, next) => {
  if (req.course.image.data) {
    res.set("Content-Type", req.course.image.contentType);
    return res.send(req.course.image.data);
  }
  next();
};

const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd() + defaultProfileImg);
};

module.exports = {
  create,
  courseByID,
  read,
  list,
  update,
  newLesson,
  remove,
  isInstructor,
  listByInstructor,
  listPublished,
  photo,
  defaultPhoto,
};
