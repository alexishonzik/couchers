import { makeStyles } from "@material-ui/core";
import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

import { SearchQuery } from "../features/search/constants";
import { routeToSearch } from "../routes";
import TextField from "./TextField";

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(2),
  },
}));

export default function SearchBox() {
  const classes = useStyles();

  const { register, handleSubmit } = useForm<SearchQuery>();

  const history = useHistory();

  const onSubmit = handleSubmit(({ query }) => {
    history.push(routeToSearch(encodeURIComponent(query)));
  });

  return (
    <>
      <form onSubmit={onSubmit} className={classes.root}>
        <TextField name="query" label="Search" inputRef={register}></TextField>
      </form>
    </>
  );
}
