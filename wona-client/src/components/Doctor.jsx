import React, { Component } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export class Doctor extends Component {
  render() {
    dayjs.extend(relativeTime);
    const {
      doctor: { doctorId, avatar, firstName, lastName, department, location },
    } = this.props;
    return (
      <Link
        className="card-link text-dark"
        to={`/doctor/${doctorId}/${firstName}-${lastName}-${department}`}
      >
        <div
          className="row card-deck mx-0 mb-1 mb-md-3 shadow"
          style={{ flexFlow: "row wrap" }}
        >
          <div className="col-4 card card-body border-0 m-0 p-0 bg-light">
            <img
              src={avatar}
              title={firstName}
              className="h-100 w-100"
              alt=""
            />
          </div>
          <div className="col-8 card border-0 m-0">
            <div className="card-body px-1">
              Dr. {firstName + " " + lastName}
              <div className="text-muted">{department}</div>
              <p className="mt-2 mb-0 text-truncate">
                <FontAwesomeIcon
                  className="small text-muted me-2"
                  icon={["fas", "map-pin"]}
                />
                {location.address}
              </p>
            </div>
          </div>
        </div>
      </Link>
    );
  }
}

export default Doctor;
