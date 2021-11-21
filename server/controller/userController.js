const User = require("../model/userModel");
const _ = require("lodash");
const formidable = require("formidable");
const fs = require("fs");
const extend = require("lodash/extend");
const errorHandler = require("../helpers/dbErrorHandler");
const defaultProfileImg = "";

const create = async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    console.log(`--- users who just got created ---`);
    console.log(user);
    return res.status(200).json({
      message: `signed up successfully`,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        error: `User with that ID not found`,
      });
    }
    req.profile = user;

    next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const read = async (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;

  return res.json(req.profile);
};

const list = async (req, res) => {
  try {
    let users = await User.find().select(
      "name email updated about educator created"
    );
    console.log(`--- List of all users in DB ---`);
    console.log(users);
    res.json(users);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: `photo could not be uploaded` });
    }
    let user = req.profile;
    user = extend(user, fields);
    user.updated = Date.now();
    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.filepath);
      console.log(`----user photo data-----`);
      user.photo.contentType = files.photo.type;
    }
    try {
      await user.save();
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
};

const remove = async (req, res) => {
  try {
    let user = req.profile;
    let deleteUser = await user.remove();
    deleteUser.hashed_password = undefined;
    deleteUser.salt = undefined;

    res.json({
      message: `User delelted`,
      deleteUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const photo = (req, res, next) => {
  console.log(`-----profile photo data-----`);
  if (req.profile.photo.data) {
    res.set("Content-Type", req.profile.photo.contentType);
    return res.send(req.profile.photo.data);
  }
  next();
};

const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd() + defaultProfileImg);
};

const isEducator = async (req, res, next) => {
  const isEducator = req.profile && req.profile.educator;

  if (!isEducator) {
    return res.status(403).json({
      error: `Unauthorized, user is not an educator`,
    });
  }

  next();
};

module.exports = {
  create,
  userByID,
  read,
  list,
  update,
  remove,
  isEducator,
  photo,
  defaultPhoto,
};
