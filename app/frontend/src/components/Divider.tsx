import { Divider as MuiDivider } from "@material-ui/core";
import React from "react";
import makeStyles from "utils/makeStyles";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
}));

export default function Divider() {
  const classes = useStyles();

  return <MuiDivider className={classes.root} />;
}
