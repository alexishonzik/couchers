import { Chip, makeStyles, useMediaQuery, useTheme } from "@material-ui/core";
import React, { useState } from "react";

const useStyles = makeStyles((theme) => ({
  "@keyframes attention": {
    from: { opacity: 0.5 },
    to: { opactiy: 0.9 },
  },
  banner: {
    animation: "2s infinite alternate $attention",
    position: "fixed",
    bottom: theme.spacing(1),
    right: theme.spacing(1),
    zIndex: 5000,
    "&.MuiChip-root": {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.common.white,
    },
  },
}));

export function EnvironmentBanner() {
  const theme = useTheme();
  const classes = useStyles();
  const isBelowSm = useMediaQuery(theme.breakpoints.down("sm"));
  const [isHidden, setIsHidden] = useState(false);

  if (isHidden || process.env.REACT_APP_COUCHERS_ENV === "prod") {
    return null;
  } else {
    return (
      <Chip
        className={classes.banner}
        label={`This is a ${
          process.env.REACT_APP_COUCHERS_ENV === "preview"
            ? "preview"
            : "development"
        } build of the app.${
          !isBelowSm
            ? " It uses a separate database to the production app."
            : ""
        }`}
        onDelete={() => setIsHidden(true)}
      />
    );
  }
}
