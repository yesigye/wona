import React, { Component } from "react";
import propTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Components
import Doctor from "../components/Doctor";

// Redux
import { connect } from "react-redux";
import { getDoctors, filterDoctors } from "../redux/actions/doctorsActions";

export class doctors extends Component {
  state = {
    doctorsTotal: 0,
    filters: {
      department: "all",
    },
  };

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

    if (!filters.hasOwnProperty(filter)) return null;

    filters[filter] = event.target.value;
    this.setState({ filters });
    this.props.filterDoctors(filter, event.target.value);
  };

  render() {
    const { doctorsTotal, filters } = this.state;
    const { doctors, loading } = this.props;
    const count = this.props.doctors.length;

    return (
      // <div style={{paddingTop: '1rem'}}>
      //   <Grid container spacing={2}>
      //     <Grid item sm={8} xs={12}>
      //       <Select className={classes.select} labelId="label" id="select" value="0" variant="outlined" size="">
      //         <ListSubheader>SERVICES</ListSubheader>
      //         <MenuItem value="0">All Services</MenuItem>
      //         {['Profile','User Management', 'Logout'].map(slot => (
      //           <MenuItem value={slot}>{slot}</MenuItem>
      //           ))}
      //       </Select>
      //       <Select
      //         variant="outlined"
      //         className={classes.select}
      //         value={filters.department}
      //         onChange={event => this.handleListChange(event, 'department')}
      //       >
      //         <ListSubheader>SPECIALITY</ListSubheader>
      //         <MenuItem value="all">All Specialities</MenuItem>
      //         {['Dentist','Optician', 'Psychiatrist'].map(value => (
      //           <MenuItem value={value}>{value}</MenuItem>
      //         ))}
      //       </Select>
      //       <Select
      //         variant="outlined"
      //         className={classes.select}
      //         value="0"
      //         onChange={event => this.handleListChange(event, 'slot')}
      //       >
      //         <ListSubheader>SLOTS</ListSubheader>
      //         <MenuItem value="0">All Slots</MenuItem>
      //         {['morning slots','afternoon slots','evening slots', 'night slots'].map(slot => (
      //           <MenuItem value={slot}>{slot}</MenuItem>
      //         ))}
      //       </Select>

      //       <Select className={classes.select} labelId="label" id="select" value="0" variant="outlined">
      //         <ListSubheader>LOCATION</ListSubheader>
      //         <MenuItem value="0">All cities</MenuItem>
      //         {['Kampala','Entebbe', 'Mbarara'].map(slot => (
      //           <MenuItem value={slot}>{slot}</MenuItem>
      //         ))}
      //       </Select>
      //   </Grid>
      //     <Grid item sm={4} xs={12}>
      //       <Toolbar className={classes.toolbar}>
      //         <InputBase
      //         fontSize={14}
      //         className={classes.search}
      //         color={'secondary'}
      //         placeholder={'Search'}
      //         startAdornment={<SearchIcon className={classes.iconSearch} /> }
      //         />
      //         <IconButton size="small" className={classes.iconButton} aria-label="search">
      //           <RefreshIcon />
      //         </IconButton>
      //       </Toolbar>
      //     </Grid>
      //   </Grid>

      //   {loading ? <p>loading....</p> : (
      //     <div>
      //       <Typography color="textSecondary" className="mt2 mb2">
      //         {count} of {doctorsTotal ? doctorsTotal : count} doctors
      //       </Typography>
      //       <Grid container spacing={2}>
      //         { doctors.map((doctor) => (
      //           <Grid item sm={4} xs={6} key={doctor.doctorId}>
      //             <Doctor doctor={doctor} key={doctor.doctorId} />
      //           </Grid>
      //         )) }
      //       </Grid>
      //     </div>
      //   )}
      // </div>
      <React.Fragment>
        <div className="sticky-top bg-white">
          <div className="row my-4">
            <div className="col-md-4 order-md-2">
              <div className="input-group input-group-lg my-2">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={["fas", "search"]} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for a hospital"
                />
              </div>
            </div>
            <div className="col-md-8 order-md-1">
              <ul
                className="nav horizontal-scroll mt-md-2 md-shadow"
                id="filter-tabs"
                role="tablist"
              >
                <li className="nav-item scroll-item">
                  <div class="d-flex">
                    <h3 class="me-3 rounded-circle">
                      <FontAwesomeIcon icon={["fas", "search"]} />
                    </h3>
                    <div>
                      <div className="text-uppercase small">Services</div>
                      <select class="form-control text-primary d-inline border-0 p-0">
                        {["Dentist", "Optician", "Psychiatrist"].map(
                          (value, i) => (
                            <option value={value} key={i}>
                              {value}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                </li>
                <li className="nav-item scroll-item">
                  <div class="d-flex">
                    <h3 class="me-3 rounded-circle">S</h3>
                    <div>
                      <div className="text-uppercase small">Specialities</div>
                      <select class="form-control text-primary d-inline border-0 p-0">
                        {["Dentist", "Optician", "Psychiatrist"].map(
                          (value, i) => (
                            <option value={value} key={i}>
                              {value}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="row">
          {doctors.map((doctor) => (
            <div className="col-md-4" key={doctor.doctorId}>
              <Doctor doctor={doctor} key={doctor.doctorId} />
            </div>
          ))}
        </div>
      </React.Fragment>
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

export default connect(mapStateToProps, { getDoctors, filterDoctors })(doctors);
