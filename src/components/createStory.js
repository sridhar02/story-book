import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import Axios from "axios";
import {
  TextField,
  TextareaAutosize,
  makeStyles,
  Button,
  InputLabel,
  Input,
  InputAdornment,
} from "@material-ui/core";
import NativeSelect from "@material-ui/core/NativeSelect";

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
}));

export default function CreateStory() {
  const classes = useStoryStyles();
  const history = useHistory();

  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [complexity, setcomplexity] = useState("");
  const [estimatedHrs, setEstimatedHrs] = useState("");
  const [cost, setCost] = useState("");

  const createStory = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    console.log(token);
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
  };

  return (
    <div className={classes.container}>
      <h1>Create Story </h1>
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
