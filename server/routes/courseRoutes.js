const express = require("express");
const CourseController = require("../controller/courseController");
const UserController = require("../controller/userController");
const AuthController = require("../controller/authController");

const router = express.Router();

router.route("/api/courses/published").get(CourseController.listPublished);

router
  .route("/api/courses/by/:userId")
  .post(
    AuthController.requireSignin,
    AuthController.hasAuthorization,
    UserController.isEducator,
    CourseController.create
  )
  .get(
    AuthController.requireSignin,
    AuthController.hasAuthorization,
    CourseController.listByInstructor
  );

router
  .route("/api/courses/photo/:courseId")
  .get(CourseController.photo, CourseController.defaultPhoto);

router.route("/api/courses/defaultPhoto").get(CourseController.defaultPhoto);

router
  .route("/api/courses/:courseId/lesson/new")
  .put(
    AuthController.requireSignin,
    CourseController.isInstructor,
    CourseController.newLesson
  );

router
  .route("/api/courses/:courseId")
  .get(CourseController.read)
  .put(
    AuthController.requireSignin,
    CourseController.isInstructor,
    CourseController.update
  )
  .delete(
    AuthController.requireSignin,
    CourseController.isInstructor,
    CourseController.remove
  );

router.param("courseId", CourseController.courseByID);
router.param("userId", UserController.userByID);

module.exports = router;
