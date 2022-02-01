import React from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiButton from "@material-ui/core/Button";

/**
 * Themeing bootstrap like contextual buttons
 */
const Button = withStyles((theme) => ({
  outlinedSuccess: {
    borderColor: theme.palette.success.main,
    color: theme.palette.success.main,
    "&:hover": {
      color: theme.palette.success.contrastText,
      backgroundColor: theme.palette.success.dark,
      borderColor: theme.palette.success.main,
    },
    "&:active": {
      color: theme.palette.success.contrastText,
      backgroundColor: theme.palette.success.main,
      borderColor: theme.palette.success.light,
    },
  },
  outlinedError: {
    borderColor: theme.palette.error.main,
    color: theme.palette.error.main,
    "&:hover": {
      color: theme.palette.error.contrastText,
      backgroundColor: theme.palette.error.dark,
      borderColor: theme.palette.error.main,
    },
    "&:active": {
      color: theme.palette.error.contrastText,
      backgroundColor: theme.palette.error.main,
      borderColor: theme.palette.error.light,
    },
  },
  outlinedWarning: {
    borderColor: theme.palette.warning.main,
    color: theme.palette.warning.main,
    "&:hover": {
      color: theme.palette.warning.contrastText,
      backgroundColor: theme.palette.warning.dark,
      borderColor: theme.palette.warning.main,
    },
    "&:active": {
      color: theme.palette.warning.contrastText,
      backgroundColor: theme.palette.warning.main,
      borderColor: theme.palette.warning.light,
    },
  },
  outlinedInfo: {
    borderColor: theme.palette.info.main,
    color: theme.palette.info.main,
    "&:hover": {
      color: theme.palette.info.contrastText,
      backgroundColor: theme.palette.info.dark,
      borderColor: theme.palette.info.main,
    },
    "&:active": {
      color: theme.palette.info.contrastText,
      backgroundColor: theme.palette.info.main,
      borderColor: theme.palette.info.light,
    },
  },
  containedSuccess: {
    color: theme.palette.success.contrastText,
    backgroundColor: theme.palette.success.main,
    borderColor: theme.palette.success.light,
    "&:hover": {
      backgroundColor: theme.palette.success.dark,
      borderColor: theme.palette.success.main,
    },
    "&:active": {
      backgroundColor: theme.palette.success.main,
      borderColor: theme.palette.success.light,
    },
  },
  containedError: {
    color: theme.palette.error.contrastText,
    backgroundColor: theme.palette.error.main,
    borderColor: theme.palette.error.light,
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
      borderColor: theme.palette.error.main,
    },
    "&:active": {
      backgroundColor: theme.palette.error.main,
      borderColor: theme.palette.error.light,
    },
  },
  containedWarning: {
    color: theme.palette.warning.contrastText,
    backgroundColor: theme.palette.warning.main,
    borderColor: theme.palette.warning.light,
    "&:hover": {
      backgroundColor: theme.palette.warning.dark,
      borderColor: theme.palette.warning.main,
    },
    "&:active": {
      backgroundColor: theme.palette.warning.main,
      borderColor: theme.palette.warning.light,
    },
  },
  containedInfo: {
    color: theme.palette.info.contrastText,
    backgroundColor: theme.palette.info.main,
    borderColor: theme.palette.info.light,
    "&:hover": {
      backgroundColor: theme.palette.info.dark,
      borderColor: theme.palette.info.main,
    },
    "&:active": {
      backgroundColor: theme.palette.info.main,
      borderColor: theme.palette.info.light,
    },
  },
}))(MuiButton);

export default function CustomButton(props) {
  const { color, ...other } = props;

  return <Button {...other}>{props.children}</Button>;
}
