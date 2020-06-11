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
  padding: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
  },
}));

export default function CreateStory() {
  const history = useHistory();
  const classes = useStoryStyles();

  const [cost, setCost] = useState("");
  const [summary, setSummary] = useState("");
  const [type, setType] = useState("enhancement");
  const [complexity, setcomplexity] = useState("low");
  const [showError, setShowError] = useState(false);
  const [description, setDescription] = useState("");
  const [estimatedHrs, setEstimatedHrs] = useState("");

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
    if (summary.length === 0 || description.length === 0) {
      setShowError(true);
    } else {
      try {
        const response = await Axios({
          url: `${process.env.REACT_APP_BACKEND_API}/api/v1/stories`,
          method: "post",
          data: {
            summary,
            description,
            type,
            complexity,
            estimatedHrs,
            cost,
          },
          headers: {
            Authorization: token,
          },
        });
        if (response.status === 201) {
          history.push("/stories");
        }
      } catch (error) {
        alert(error);
      }
    }
  };

  return (
    <div className={classes.container}>
      {isLoggedIn === false && <Redirect to="/" />}
      <Navbar />
      <Divider />
      <Typography variant="h4" className={classes.text}>
        Create Story
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
            className={classes.padding}
            aria-label="minimum height"
            rowsMin={10}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Minimum 3 rows"
          />
          {showError && (
            <Alert severity="error" className={classes.spacing}>
              Please enter the summary and description!
            </Alert>
          )}
          <InputLabel className={classes.spacing} id="select-type">
            Type
          </InputLabel>
          <NativeSelect
            id="select-type"
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option value={"enhancement"}>enhancement</option>
            <option value={"bugfix"}>bugfix</option>
            <option value={"development"}>development</option>
            <option value={"qa"}>QA</option>
          </NativeSelect>
          <InputLabel className={classes.spacing} htmlFor="select-complexity">
            Complexity
          </InputLabel>
          <NativeSelect
            id="select-complexity"
            value={complexity}
            onChange={(event) => setcomplexity(event.target.value)}
          >
            <option value="low">Low</option>
            <option value="mid">Mid</option>
            <option value="high">High</option>
          </NativeSelect>
          <InputLabel className={classes.spacing} htmlFor="estimatedHrs">
            Estimated time for completion
          </InputLabel>
          <Input
            className={classes.spacing}
            id="estimatedHrs"
            value={estimatedHrs}
            onChange={(event) => setEstimatedHrs(event.target.value)}
            endAdornment={<InputAdornment position="end">Hours</InputAdornment>}
            aria-describedby="estimatedHrs"
            inputProps={{
              "aria-label": "estimatedHrs",
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
