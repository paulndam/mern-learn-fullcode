const express = require("express");
const EnrollController = require("../controller/enrollController");
const AuthController = require("../controller/authController");
const CourseController = require("../controller/courseController");

const router = express.Router();

router
  .route("/api/enrollment/enrolled")
  .get(AuthController.requireSignin, EnrollController.listEnrolled);

router
  .route("/api/enrollment/new/:courseId")
  .post(
    AuthController.requireSignin,
    EnrollController.findEnrollment,
    EnrollController.create
  );

router
  .route("/api/enrollment/stats/:courseId")
  .get(EnrollController.enrollmentStats);

router
  .route("/api/enrollment/complete/:enrollmentId")
  .put(
    AuthController.requireSignin,
    EnrollController.isStudent,
    EnrollController.complete
  );

router
  .route("/api/enrollment/:enrollmentId")
  .get(
    AuthController.requireSignin,
    EnrollController.isStudent,
    EnrollController.read
  )
  .delete(
    AuthController.requireSignin,
    EnrollController.isStudent,
    EnrollController.remove
  );

router.param("courseId", CourseController.courseByID);
router.param("enrollmentId", EnrollController.enrollmentByID);

module.exports = router;
