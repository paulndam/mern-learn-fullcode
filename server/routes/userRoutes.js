const express = require("express");
const UserController = require("../controller/userController");
const AuthController = require("../controller/authController");

const router = express.Router();

router
  .route("/api/users/")
  .get(UserController.list)
  .post(UserController.create);

router
  .route("/api/users/photo/:userId")
  .get(UserController.photo, UserController.defaultPhoto);
router.route("/api/users/defaultphoto").get(UserController.defaultPhoto);

router
  .route("/api/users/:userId")
  .get(AuthController.requireSignin, UserController.read)
  .put(
    AuthController.requireSignin,
    AuthController.hasAuthorization,
    UserController.update
  )
  .delete(
    AuthController.requireSignin,
    AuthController.hasAuthorization,
    UserController.remove
  );

router.param("userId", UserController.userByID);

module.exports = router;
