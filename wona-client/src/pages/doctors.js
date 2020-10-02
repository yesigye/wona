import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import propTypes from "prop-types";

// Components
import Doctor from "../components/Doctor";

// Redux
import { connect } from "react-redux";
import { getDoctors } from "../redux/actions/dataActions";

export class doctors extends Component {
  componentDidMount() {
    this.props.getDoctors();
  }
  render() {
    const { doctors, loading } = this.props.data;
    let recentDoctorsMarkup = !loading ? (
      doctors.map((doctor) => (
        <Grid item sm={6} xs={12}>
          <Doctor doctor={doctor} key={doctor.doctorId} />
        </Grid>
      ))
    ) : (
      <p>Loading....</p>
    );

    return (
      <Grid container spacing={2}>
        {recentDoctorsMarkup}
      </Grid>
    );
  }
}

doctors.propTypes = {
  getDoctors: propTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { getDoctors })(doctors);
