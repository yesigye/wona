import React from "react";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Toast(props) {
  const [open, setOpen] = React.useState(true);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const getPlacement = (place) => {
    switch (place) {
      case "top":
        return { horizontal: "right", vertical: "top" };
      default:
        return { horizontal: "center", vertical: "bottom" };
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={props.stay ? null : 6000}
      onClose={handleClose}
      anchorOrigin={getPlacement(props.placement)}
      message={props.message}
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    >
      {props.severity && (
        <Alert onClose={handleClose} severity={props.severity}>
          {props.message}
        </Alert>
      )}
    </Snackbar>
  );
}
