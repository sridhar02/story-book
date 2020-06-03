import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, Redirect, useHistory } from "react-router-dom";

import Navbar from "./navbar";
import { Button, Typography, makeStyles, Divider } from "@material-ui/core";

const useStoryStyles = makeStyles((theme) => ({
  container: {},
  text: {
    textAlign: "center",
    margin: theme.spacing(1),
  },
  storySection: {
    display: "flex",
    flexDirection: "column",
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

function useLocalStorageState(key, defaultValue = "") {
  const [state, setState] = React.useState(() => {
    let rejected = window.localStorage.getItem(key);
    if (rejected !== null || undefined) {
      return JSON.parse(window.localStorage.getItem(key)) || defaultValue;
    }
    return defaultValue;
  });

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

export default function Story() {
  let { id } = useParams();
  const history = useHistory();
  const classes = useStoryStyles();

  const [role, setRole] = useState("");
  const [story, setStory] = useState("");
  const [rejected, setRejected] = useLocalStorageState("rejected", []);
  const [accepted, setAccepted] = useLocalStorageState("accepted", []);

  const [isLoggedIn] = useState(() => {
    if (
      localStorage.getItem("token") &&
      localStorage.getItem("token").length !== 0
    ) {
      return true;
    }
    return false;
  });

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

  const rejectedStory = (id) => {
    setRejected(rejected.concat(id));
    setTimeout(() => history.push("/stories"), 100);
  };

  const AcceptedStory = (id) => {
    setAccepted(accepted.concat(id));
    setTimeout(() => history.push("/stories"), 100);
  };

  useEffect(() => {
    fetchStory();
    setRole(localStorage.getItem("role"));
  }, []);
  console.log(
    typeof rejected,
    rejected.includes(story.id, accepted.includes(story.id))
  );
  return (
    <div className={classes.container}>
      {isLoggedIn === false && <Redirect to="/" />}
      <Navbar />
      <Divider />
      <Typography className={classes.text} variant="h4">
        User Story#{id}
      </Typography>
      <div className={classes.storySection}>
        <div>
          <label>
            <strong>Summary</strong>
          </label>
          <p>{story.summary}</p>
        </div>
        <div>
          <label>
            <strong>Description</strong>
          </label>
          <p>{story.description}</p>
        </div>
        <div>
          <label>
            <strong>Type</strong>
          </label>
          <p>{story.type && story.type.toUpperCase()}</p>
        </div>
        <div>
          <label>
            <strong>complexity</strong>
          </label>
          <p>{story.complexity}</p>
        </div>
        <div>
          <label>
            <strong>Estimated time for completion</strong>
          </label>
          <p>{story.estimatedHrs}</p>
        </div>
        <div>
          <label>
            <strong>Cost</strong>
          </label>
          <p>$ {story.cost}</p>
        </div>
        {role === "Admin" && (
          // rejected.includes(story.id) &&
          // accepted.includes(story.id)
          <div className={classes.buttons}>
            <Button
              color="secondary"
              variant="contained"
              disabled={
                rejected.includes(story.id) || accepted.includes(story.id)
              }
              className={classes.cancelButton}
              onClick={() => rejectedStory(story.id)}
            >
              Rejected
            </Button>
            <Button
              color="primary"
              variant="contained"
              disabled={
                rejected.includes(story.id) || accepted.includes(story.id)
              }
              className={classes.saveButton}
              onClick={() => AcceptedStory(story.id)}
            >
              Accepted
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
