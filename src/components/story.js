import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Button, Typography, makeStyles, Divider } from "@material-ui/core";

import Navbar from "./navbar";

const useStoryStyles = makeStyles((theme) => ({
  container: {},
  text: {
    textAlign: "center",
    margin: theme.spacing(1),
  },
  storySection: {
    display: "flex",
    flexDirection: "column",
    // justifyContent: "center",
    // alignItems: "center",
    maxWidth: "400px",
    border: "1px solid #333",
    padding: theme.spacing(2),
  },
  buttons: {
    display: "flex",
  },
  cancelButton: {
    marginRight: theme.spacing(1),
    backgroundColor: "#dc3545",
  },
  saveButton: {
    backgroundColor: "#28a745",
  },
}));

export default function Story() {
  const status = React.createContext("pending");
  let { id } = useParams();
  const classes = useStoryStyles();
  const [story, setStory] = useState("");
  const [role, setRole] = useState("");

  const fetchStory = async () => {
    const userToken = localStorage.getItem("token");
    try {
      const response = await Axios({
        method: "get",
        url: `http://localhost:3000/api/v1/stories/${id}`,
        headers: {
          Authorization: userToken,
        },
      });
      if (response.status === 200) {
        setStory(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const rejectedStory = () => {};

  useEffect(() => {
    fetchStory();
    setRole(localStorage.getItem("role"));
  }, []);

  console.log(story);
  return (
    <div className={classes.container}>
      <Navbar />
      <Divider />
      <Typography className={classes.text} variant="h4">
        User Story#{id}
      </Typography>
      <div className={classes.storySection}>
        <div className="form-group">
          <label htmlFor="summary">
            <strong>Summary</strong>
          </label>
          <p className="text-capitalize">{story.summary}</p>
        </div>
        <div className="form-group">
          <label htmlFor="description">
            <strong>Description</strong>
          </label>
          <p className="text-capitalize">{story.description}</p>
        </div>
        <div className="form-group">
          <label htmlFor="type">
            <strong>Type</strong>
          </label>
          <p className="text-capitalize">{story.type}</p>
        </div>
        <div className="form-group">
          <label htmlFor="complexity">
            <strong>complexity</strong>
          </label>
          <p className="text-capitalize">{story.complexity}</p>
        </div>
        <div className="form-group">
          <label htmlFor="Estimated time for completion">
            <strong>Estimated time for completion</strong>
          </label>
          <p className="text-capitalize">{story.estimatedHrs}</p>
        </div>
        <div className="form-group">
          <label htmlFor="cost">
            <strong>Cost</strong>
          </label>
          <p className="text-capitalize">$ {story.cost}</p>
        </div>
        {role === "Admin" && (
          <div className={classes.buttons}>
            <Button
              color="secondary"
              variant="contained"
              className={classes.cancelButton}
              onClick={() => rejectedStory()}
            >
              Rejected
            </Button>
            <Button
              color="primary"
              variant="contained"
              className={classes.saveButton}
            >
              Accepted
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
