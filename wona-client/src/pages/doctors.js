import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";

import Grid from "@material-ui/core/Grid";
import propTypes from "prop-types";
import Toolbar from '@material-ui/core/Toolbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import InputBase from '@material-ui/core/InputBase';

import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';

// Components
import Doctor from "../components/Doctor";

// Redux
import { connect } from "react-redux";
import { getDoctors, filterDoctors } from "../redux/actions/doctorsActions";
import { Hidden, Typography } from "@material-ui/core";

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
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 20,
    "& .MuiSelect-outlined": {
      paddingTop: 10,
      paddingBottom: 10,
    }
  },
  iconButton: {
    marginLeft: theme.spacing(0.5),
  },
});

export class doctors extends Component {
  constructor() {
    super();
    this.state = {
      doctorsTotal: 0,
      filters: {
        department: 'all'
      }
    }
  }

  componentDidMount() {
    this.props.getDoctors();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.doctors.length &&
      this.props.doctors.length !== prevProps.doctors.length
    ) {
      // Update doctor count to retain original number after filtering
      this.setState({ doctorsTotal: prevProps.doctors.length });
    }
  }

  handleListChange = (event, filter) => {
    const filters = this.state.filters;

    if(!filters.hasOwnProperty(filter)) return null; 
    
    filters[filter] = event.target.value;
    this.setState({ filters });
    this.props.filterDoctors(filter, event.target.value);
  }

  render() {
    const { doctorsTotal, filters } = this.state;
    const { classes, doctors, loading } = this.props;
    const count = this.props.doctors.length;

    return (
      <div style={{paddingTop: '1rem'}}>
        <Grid container spacing={2}>
          <Grid item sm={8} xs={12}>
            <Select className={classes.select} labelId="label" id="select" value="0" variant="outlined" size="">
              <ListSubheader>SERVICES</ListSubheader>
              <MenuItem value="0">All Services</MenuItem>
              {['Profile','User Management', 'Logout'].map(slot => (
                <MenuItem value={slot}>{slot}</MenuItem>
                ))}
            </Select>
            <Select
              variant="outlined"
              className={classes.select}
              value={filters.department}
              onChange={event => this.handleListChange(event, 'department')}
            >
              <ListSubheader>SPECIALITY</ListSubheader>
              <MenuItem value="all">All Specialities</MenuItem>
              {['Dentist','Optician', 'Psychiatrist'].map(value => (
                <MenuItem value={value}>{value}</MenuItem>
              ))}
            </Select>
            <Select
              variant="outlined"
              className={classes.select}
              value="0"
              onChange={event => this.handleListChange(event, 'slot')}
            >
              <ListSubheader>SLOTS</ListSubheader>
              <MenuItem value="0">All Slots</MenuItem>
              {['morning slots','afternoon slots','evening slots', 'night slots'].map(slot => (
                <MenuItem value={slot}>{slot}</MenuItem>
              ))}
            </Select>
            
            <Select className={classes.select} labelId="label" id="select" value="0" variant="outlined">
              <ListSubheader>LOCATION</ListSubheader>
              <MenuItem value="0">All cities</MenuItem>
              {['Kampala','Entebbe', 'Mbarara'].map(slot => (
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
              <IconButton size="small" className={classes.iconButton} aria-label="search">
                <RefreshIcon />
              </IconButton>
            </Toolbar>
          </Grid>
        </Grid>
        
        {loading ? <p>loading....</p> : (
          <div>
            <Typography color="textSecondary" className="mt2 mb2">
              {count} of {doctorsTotal ? doctorsTotal : count} doctors
            </Typography>
            <Grid container spacing={2}>
              { doctors.map((doctor) => (
                <Grid item sm={4} xs={6} key={doctor.doctorId}>
                  <Doctor doctor={doctor} key={doctor.doctorId} />
                </Grid>
              )) }
            </Grid>
          </div>
        )}
      </div>
    );
  }
}

doctors.propTypes = {
  getDoctors: propTypes.func.isRequired,
  filterDoctors: propTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  doctors: state.doctors.data,
  loading: state.doctors.loading,
});

export default connect(
  mapStateToProps,
  { getDoctors, filterDoctors }
)(withStyles(styles)(doctors));
