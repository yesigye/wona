import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";

// Material UI
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';

import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';

// Components
import Profile from "./Profile";
import MenuButton from "./menuButton";

const outline = {
  border: "1px solid #dadce0",
  borderRadius: 48,
  padding: "5px 15px",
}
// Theme spread is from "../utils.theme"
const styles = (theme) => ({
  ...theme.custom,
  title: {
    flexGrow: 1,
  },
  appBar: {
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(2),
    fontWeight: 400,
    display: "block",
    backgroundColor: "#fff",
    color: "#888",
    borderBottom: "1px solid #e4e6e7",
  },
  logo: {
    height: 40,
    maxWidth: 160,
    verticalAlign: "bottom",
  },
  toolbar: {
    ...outline,
    display: 'flex',
    flexDirection: 'row',
    minHeight: 0,
    justifyContent: "flex-start",
    left: 0,
    overflowX: "hidden",
    position: "relative",
    right: 0
  },
  rounded: {
    ...outline,
    display: "inline-block",
    padding: 0,
    overflow: "hidden",
    marginRight: 10
  },
  iconSearch: {
    marginRight: theme.spacing(0.5),
  },
  search: {
    borderRight: "1px solid #dadce0",
    flex: 1,
  },
  select: {
    marginRight: 20,
    "& .MuiSelect-outlined": {
      paddingTop: 10,
      paddingBottom: 10,
    }
  },
  input: {
    padding: `0 ${theme.spacing(3)}px`,
    borderRight: "1px solid #dadce0",
  },
  iconButton: {
    marginLeft: theme.spacing(0.5),
  },
});

export class DoctorFilters extends Component {
  
  handleChange = event => {
    console.log(event.target)
  };

  render() {
    const { classes } = this.props;

    return (
      <Grid container spacing={2}>
        <Grid item sm={8} xs={12}>
          <Select className={classes.select} labelId="label" id="select" value="0" variant="outlined" size="">
            <ListSubheader>SERVICES</ListSubheader>
            <MenuItem value="0">All Services</MenuItem>
            {['Profile','User Management', 'Logout'].map(slot => (
              <MenuItem value={slot}>{slot}</MenuItem>
              ))}
          </Select>
          <Select className={classes.select} labelId="label" id="select" value="0" variant="outlined" size="">
            <ListSubheader>SPECIALITY</ListSubheader>
            <MenuItem value="0">All Specialities</MenuItem>
            {['Profile','User Management', 'Logout'].map(slot => (
              <MenuItem value={slot}>{slot}</MenuItem>
              ))}
          </Select>
          <Select
            variant="outlined"
            className={classes.select}
            value="0"
            onChange={this.handleChange}
          >
            <ListSubheader>SLOTS</ListSubheader>
            <MenuItem value="0">All Slots</MenuItem>
            {['morning slots','afternoon slots','evening slots', 'night slots'].map(slot => (
              <MenuItem value={slot}>{slot}</MenuItem>
            ))}
          </Select>
      </Grid>
        <Grid item sm={4} xs={12}>
          <Toolbar className={classes.toolbar}>
            <InputBase
            fontSize={14}
            className={classes.search}
            color={'secondary'}
            placeholder={'Search'}
            startAdornment={<SearchIcon className={classes.iconSearch} /> }
            />
            <div className={classes.input}>
              <MenuButton
              size="small"
              title="Location"
              items={['Profile','User Management', 'Logout']}
              />
            </div>
            <IconButton size="small" className={classes.iconButton} aria-label="search">
              <RefreshIcon />
            </IconButton>
          </Toolbar>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(DoctorFilters);
