import React, { Component } from "react";
// Day Js
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import weekday from "dayjs/plugin/weekday";
// UI
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import {
  formatTimeSlots,
  militaryTimeToStandard,
  nextOpenSlot,
} from "../utils/timeFunctions";

export class Slots extends Component {
  state = {
    slotDateRange: [],
    showingSlotDay: 0,
    showingDate: "",
    dateTimestamp: "",
  };
  constructor(props) {
    super(props);
    this.dateTabNode = React.createRef();
  }

  componentDidMount() {
    // TODO: Let the max number come from docotor settings
    // Show booking slots up to 8 days in future
    const maxSlotDaysShowing = 8;
    let bookDates = [];
    for (let i = 0; i < maxSlotDaysShowing; i++) {
      bookDates.push(dayjs().add(i, "day"));
    }
    this.setState({ slotDateRange: bookDates });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.selectedDate && !this.state.dateTimestamp) {
      // Difference between today and the booking/selected date
      const dateDiff = dayjs.unix(this.props.selectedDate).diff(Date(), "day");
      this.setState({
        dateTimestamp: this.props.selectedDate,
        showingSlotDay: dateDiff ? dateDiff + 1 : dateDiff,
      });
    }
  }

  handleTabChange = (num, e) => {
    this.setState({ showingSlotDay: num });
    const node = this.dateTabNode.current;
    console.log(node);
    // e.target.scrollIntoView();
  };
  handleButtonChange = (date) => {
    if (date === undefined) return false;
    this.setState({
      showingDate: date,
      dateTimestamp: "" + dayjs(date).unix(),
    });
    this.props.handleBooking(date);
  };

  // Render Html for a slot time period
  renderPeriod = (title, period, slotDate) => {
    return (
      period.length > 0 && (
        <div className="my-2">
          <p className="text-uppercase small text-muted">
            {title + " ("}
            <span className="text-lowercase">{period.length} slots</span>
            {")"}
          </p>
          <div className="row mt-1">
            {period.map((time) => {
              const formatedDate = slotDate.format("YYYY-MM-DD") + " " + time;
              const unixTime = "" + dayjs(formatedDate).unix();
              const selected = this.state.dateTimestamp === unixTime;

              return (
                <div class="col-3 col-md-3 px-1" key={time}>
                  <button
                    className={`mb-2 btn d-block w-100 btn-sm btn-${
                      selected ? "secondary" : "light"
                    }`}
                    onClick={() =>
                      this.handleButtonChange(
                        slotDate.format("YYYY-MM-DD") + " " + time
                      )
                    }
                  >
                    {militaryTimeToStandard(time)}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )
    );
  };
  // Rearrange slots into time period categories
  renderContentHtml = (slot, doctor) => {
    if (slot.total === 0) {
      if (doctor.slots) {
        if (slot.date.diff(dayjs(), "day") === 0) {
          // no slots for Today. Show user next available slot
          let nextSlot = nextOpenSlot(doctor.slots, slot.date);
          return (
            <React.Fragment>
              <p className="text-muted text-left mt-2 mb-3">
                Next available date:{" "}
                {slot.date.add(nextSlot.index, "day").format("ddd MMM, D")}
              </p>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={(e) => this.handleTabChange(e, nextSlot.index + 1)}
              >
                show slots
              </button>
            </React.Fragment>
          );
        }
      }
      return <span color="text-muted">No available slots</span>;
    }

    return (
      <React.Fragment>
        {this.renderPeriod("Morning", slot.period.morning, slot.date)}
        {this.renderPeriod("Afternoon", slot.period.afternoon, slot.date)}
        {this.renderPeriod("Evening", slot.period.evening, slot.date)}
        {this.renderPeriod("Night", slot.period.night, slot.date)}
      </React.Fragment>
    );
  };
  // Header text for slot days
  renderHeader = (slot, index) => {
    let headerText = "";

    switch (index) {
      case 0:
        headerText = "Today";
        break;
      case 1:
        headerText = "Tomorrow";
        break;
      default:
        headerText = slot.date.format("ddd MMM, D");
        break;
    }

    return (
      <div className="small text-center">
        {headerText}
        <div style={{ opacity: 0.5 }}>
          {slot.total + " "}
          slots available
        </div>
      </div>
    );
  };

  render() {
    dayjs.extend(relativeTime);
    dayjs.extend(weekday);

    const { doctor } = this.props;
    const { showingSlotDay, slotDateRange } = this.state;

    let doctorSlots = formatTimeSlots(
      doctor.slots,
      slotDateRange,
      doctor.booked
    );

    return (
      <React.Fragment>
        {!doctorSlots ? (
          <p className="text-muted">No available slots</p>
        ) : (
          <Tabs
            className="horizontal-scroll nav-pills mb-2"
            activeKey={showingSlotDay}
            onSelect={(k, e) => this.handleTabChange(k, e)}
            ref={this.dateTabNode}
          >
            {doctorSlots.map((slot, i) => {
              return (
                <Tab
                  className="pt-2"
                  eventKey={i}
                  key={i}
                  title={this.renderHeader(slot, i)}
                >
                  {this.renderContentHtml(slot, doctor)}
                </Tab>
              );
            })}
          </Tabs>
        )}
      </React.Fragment>
    );
  }
}

export default Slots;
