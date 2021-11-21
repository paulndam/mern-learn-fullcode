import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import auth from "../../auth/AuthHelper";
import { Redirect } from "react-router-dom";
import { create } from "../../api/Api-Enrollment";

const Enroll = (props) => {
  const [values, setValues] = useState({
    enrollmentId: "",
    error: "",
    redirect: false,
  });
  const jwt = auth.isAuthenticated();

  const clickEnroll = () => {
    create(
      {
        courseId: props.courseId,
      },
      {
        t: jwt.token,
      }
    ).then((data) => {
      //   console.log(data);
      if (data && data.error) {
        //   console.log(data);
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, enrollmentId: data._id, redirect: true });
      }
    });
  };

  if (values.redirect) {
    return <Redirect to={`/learn/${values.enrollmentId}`} />;
  }

  return (
    <Stack spacing={2} direction="row">
      <Button
        size="small"
        variant="contained"
        color="warning"
        onClick={clickEnroll}
        sx={{ marginBottom: 7, marginLeft: 5 }}
      >
        Enroll
      </Button>
    </Stack>
  );
};

Enroll.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default Enroll;
