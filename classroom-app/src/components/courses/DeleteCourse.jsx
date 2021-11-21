import React, { useState } from "react";
import PropTypes from "prop-types";
import auth from "../../auth/AuthHelper";
import { remove } from "../../api/Api-Course";
import { Redirect } from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteCourse = (props) => {
  const [open, setOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const jwt = auth.isAuthenticated();

  const clickButton = () => {
    setOpen(true);
  };

  const deleteCourse = () => {
    remove({ courseId: props.course._id }, { t: jwt.token }).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOpen(false);
        props.onRemove(props.course);
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" onClick={clickButton} color="error">
        Delete Course
      </Button>
      <div>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{`Delete ${props.course.name} Course`}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Are you sure about deleting {props.course.name} ?
              <Box
                component="div"
                sx={{
                  marginTop: 2,
                }}
              >
                <CardMedia
                  component="img"
                  height="394"
                  image={require("../../assets/images/q1.jpeg").default}
                  alt="Paella dish"
                />
              </Box>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Stack direction="row" spacing={2}>
              <Button onClick={deleteCourse} variant="contained" color="error">
                Confirm
              </Button>
              <Button onClick={handleClose} variant="contained" color="warning">
                Cancel
              </Button>
            </Stack>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

DeleteCourse.propTypes = {
  courseId: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default DeleteCourse;
