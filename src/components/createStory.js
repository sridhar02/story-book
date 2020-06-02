import React, { useState } from "react";
import { useHistory, Redirect } from "react-router-dom";

import Axios from "axios";
import {
  TextField,
  TextareaAutosize,
  makeStyles,
  Button,
  InputLabel,
  Input,
  InputAdornment,
  Typography,
  Divider,
} from "@material-ui/core";
import NativeSelect from "@material-ui/core/NativeSelect";
import Alert from "@material-ui/lab/Alert";

import Navbar from "./navbar";

const useStoryStyles = makeStyles((theme) => ({
  spacing: {
    marginTop: theme.spacing(2),
  },
  container: {
    display: "flex",
    // alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: "900px",
  },
  text: {
    textAlign: "center",
    padding: theme.spacing(1),
  },
}));

export default function CreateStory() {
  const classes = useStoryStyles();
  const history = useHistory();

  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("enhancement");
  const [complexity, setcomplexity] = useState("");
  const [estimatedHrs, setEstimatedHrs] = useState("");
  const [cost, setCost] = useState("");
  const [showError, setShowError] = useState(false);
  const [isLoggedIn] = useState(() => {
    if (
      localStorage.getItem("token") &&
      localStorage.getItem("token").length !== 0
    ) {
      return true;
    }
    return false;
  });

  const createStory = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    console.log(token);
    if (summary.length === 0 || description.length === 0) {
      setShowError(true);
    } else {
      try {
        const response = await Axios({
          method: "post",
          url: `http://localhost:3000/api/v1/stories`,
          data: {
            summary,
            description,
            type,
            complexity,
            //   estimatedHrs,
            //   cost,
          },
          headers: {
            Authorization: token,
          },
        });
        console.log(response);
        if (response.status === 201) {
          console.log(response.data);
          history.push("/stories");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className={classes.container}>
      {isLoggedIn && <Redirect to="/" />}
      <Navbar />
      <Divider />
      <Typography variant="h4" className={classes.text}>
        Create Story{" "}
      </Typography>
      <Divider />
      <form onSubmit={createStory}>
        <div className={classes.form}>
          <TextField
            className={classes.spacing}
            label="Summary"
            variant="outlined"
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
          />
          <TextareaAutosize
            className={classes.spacing}
            aria-label="minimum height"
            rowsMin={10}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Minimum 3 rows"
          />
          {showError && (
            <Alert severity="error">
              Please enter the summary and description!
            </Alert>
          )}
          <InputLabel className={classes.spacing} id="demo-simple-select-label">
            Type
          </InputLabel>
          <NativeSelect
            id="demo-simple-select"
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option value={"enhancement"}>enhancement</option>
            <option value={"bugfix"}>bugfix</option>
            <option value={"development"}>development</option>
          </NativeSelect>
          <InputLabel className={classes.spacing} htmlFor="select">
            Complexity
          </InputLabel>
          <NativeSelect
            id="select"
            value={complexity}
            onChange={(event) => setcomplexity(event.target.value)}
          >
            <option value="low">Low</option>
            <option value="mid">Mid</option>
            <option value="high">High</option>
          </NativeSelect>
          <InputLabel
            className={classes.spacing}
            htmlFor="standard-adornment-amount"
          >
            Estimated time for completion
          </InputLabel>
          <Input
            className={classes.spacing}
            id="standard-adornment-weight"
            value={estimatedHrs}
            onChange={(event) => setEstimatedHrs(event.target.value)}
            endAdornment={<InputAdornment position="end">Hours</InputAdornment>}
            aria-describedby="standard-weight-helper-text"
            inputProps={{
              "aria-label": "hours",
            }}
          />
          <InputLabel className={classes.spacing} htmlFor="cost">
            Cost
          </InputLabel>
          <Input
            id="cost"
            value={cost}
            onChange={(event) => setCost(event.target.value)}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
          />
          <div className={classes.spacing}>
            <Button variant="contained" type="submit" color="primary">
              Create Story
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
