import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

// Redux
import { connect } from "react-redux";
import { editUserDetails } from "../redux/actions/userActions";

// Material UI
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
// Card logos
import logoVisa from "../components/payment/card/visa.svg"
import logoMastercard from "../components/payment/card/mastercard.svg"

const styles = (theme) => ({
  ...theme.custom,
  creditCard: {
    transform: "scale(0.78)",
    transition: "width 1.5s",
    width: 435,
    height: 240,
    borderRadius: 10,
    backgroundColor: "#5d6874",
    padding: 20,
  },
  input: {
    color: "#fff",
    fontSize: "2em",
    lineHeight: "2em",
    border: "none",
    background: "none",
    width: 100,
    outline: "none !important",
  },
  holder: {
    position: "relative",
  },
  cardImage: {
    height: 75,
  },
  invalid: {
    textDecoration: "line-through",
  },
  "::placeholder": {
    color: "#fff",
  },
  payCard: {
    ...theme.custom.payBlock,
    backgroundColor: "#ffc107",
    "&:hover": {
      backgroundColor: "#e0a800",
      borderColor: "#d39e00",
      boxShadow: "none",
    },
  },
});

const cardsImages = {
  visa: "https://placehold.it/120x60.png?text=Visa",
  mastercard: "https://placehold.it/120x60.png?text=MasterCard",
};
const cardsBg = {
  visa: {
    background: "linear-gradient(135deg, #622774 0%, #c53364 100%)",
  },
  mastercard: {
    background: "linear-gradient(135deg, #65799b 0%, #5e2563 100%)",
  },
};
const countries = [
  {
    code: "US",
    currency: "USD",
    currencyName: "",
    country: "United States",
  },
  {
    code: "NG",
    currency: "NGN",
    currencyName: "",
    country: "Nigeria",
  },
  {
    code: "KE",
    currency: "KES",
    currencyName: "",
    country: "Kenya",
  },
  {
    code: "UG",
    currency: "UGX",
    currencyName: "",
    country: "Uganda",
  },
  {
    code: "RW",
    currency: "RWF",
    currencyName: "",
    country: "Rwanda",
  },
  {
    code: "TZ",
    currency: "TZS",
    currencyName: "",
    country: "Tanzania",
  },
  {
    code: "ZA",
    currency: "ZAR",
    currencyName: "",
    country: "South Africa",
  },
  {
    code: "CM",
    currency: "XAF",
    currencyName: "",
    country: "Cameroon",
  },
  {
    code: "GH",
    currency: "GHS",
    currencyName: "",
    country: "Ghana",
  },
];

class creditCardButton extends Component {
  state = {
    phone: "",
    lastName: "",
    open: false,
    finished: false,
    errors: {},
    card: {
      image: "https://placehold.it/120x60.png?text=Card",
      numbers: [[], [], [], []],
      background: {}
    },
  };

  mapUserDetailsToState = (credentials) => {
    this.setState({
      phone: credentials.phone ? credentials.phone : "",
    });
  };

  componentDidMount() {
    const { credentials } = this.props.user;
    this.mapUserDetailsToState(credentials);
  }

  // Event handlers
  handleOpen = () => {
    this.setState({ open: true });
    this.mapUserDetailsToState(this.props.user.credentials);
  };

  handleClose = () => this.setState({ open: false });

  handleCloseAlert = () => this.setState({ finished: false });

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    console.log("process payment");
  };

  // Card Functions

  // Announce total. *accessibility*
  billHype = () => {
    // const billDisplay = document.querySelector(".mdc-typography--headline4");
    // if (!billDisplay) return;
    // billDisplay.addEventListener("click", () => {
    //   const billSpan = document.querySelector("[data-bill]");
    //   if (
    //     billSpan &&
    //     appState.bill &&
    //     appState.billFormatted &&
    //     appState.billFormatted === billSpan.textContent
    //   ) {
    //     window.speechSynthesis.speak(
    //       new SpeechSynthesisUtterance(appState.billFormatted)
    //     );
    //   }
    // });
  };

  formatAsMoney = (amount, buyerCountry) => {
    // // Find a given country in the array of countries
    // const country = countries.find((cty) => cty.country === buyerCountry);
    // if (country === undefined) {
    //   // Set default currency format values.
    //   country.code = "US";
    //   country.currency = "USD";
    // }
    // // Format bill as a locale currency
    // return amount.toLocaleString(`en-${country.code}`, {
    //   style: "currency",
    //   currency: country.currency,
    // });
  };

  flagIfInvalid = (field, isValid) => {
    // Used tenary operator for clean if else code
    isValid
      ? field.classList.remove("is-invalid")
      : field.classList.add("is-invalid");
  };

  expiryDateFormatIsValid = (field) => {
    // Create date object using given field value as parameter
    const date = new Date(field.value);

    // Retrun false when an improper date object is created
    return isNaN(date.getTime()) ? false : true;
  };

  detectCardType = (first4Digits) => {
    const card = this.state.card;
    
    if (first4Digits.startsWith("4")) {
      card.image = logoVisa;
      card.background = cardsBg.visa;
      this.setState({card});
    } else {
      card.image = logoMastercard;
      card.background = cardsBg.mastercard;
      this.setState({card});
    }
  };

  // Custom function to check for future dates
  isDateInFuture = (field) => {
    const date = new Date();
    // Split the month & year parts into an array
    let arr = field.value.split("/");
    // Change a 2 to a 4 digit year using a 50 year offset
    arr[1] = (arr[1] > 50 ? "19" : "20") + arr[1];
    // Set a proper fully year and month date
    date.setFullYear(arr[1], arr[0]);

    return new Date() < date;
  };

  validateCardExpiryDate = () => {
    const field = document.querySelector("[data-cc-info] input:last-child");
    // delegate date format and future validation
    if (this.expiryDateFormatIsValid(field) && this.isDateInFuture(field)) {
      const errors = this.state.errors;
      errors.date = true;
      this.setState({ errors });
      return true;
    }

    // By default, fail the validation
    const errors = this.state.errors;
    errors.date = false;
    this.setState({ errors });
    return false;
  };

  validateCardHolderName = () => {
    // const field = document.querySelector("[data-cc-info] input:first-child");
    // // Separate names by space
    // const arr = field.value.split(" ");
    // // Confirm 2 names, each at least characters
    // if (arr.length === 2 && arr[0].length > 2 && arr[1].length > 2) {
    //   flagIfInvalid(field, true);
    //   return true;
    // }
    // // By default, fail the validation
    // flagIfInvalid(field, false);
    // return false;
  };

  validateCardNumber = () => {
    // const cardDigits = document.querySelector("[data-cc-digits]");
    // // flatted array of arrays to a single array and validate
    // const isValidated = validateWithLuhn(appState.cardDigits.flat());
    // if (isValidated) {
    //   cardDigits.classList.remove("is-invalid");
    //   return true;
    // } else {
    //   cardDigits.classList.add("is-invalid");
    //   return false;
    // }
  };

  validateWithLuhn = (digits) => {
    // Refuse digits whose length is not 16
    if (digits.length !== 16) {
      return false;
    }

    // Refuse digits that are not indeed numbers
    if (!digits.join("").match(/^[0-9]+$/)) {
      return false;
    }

    // Type cast strings to integers
    const casted = digits.map((x) => {
      return parseInt(x, 10);
    });
    // From second to last, loop through every other digit
    for (let i = casted.length - 2; i >= 0; i -= 2) {
      const doubled = casted[i] * 2;
      // replace digit with its double or
      // the dobule - 9 for digits bigger that 9
      casted[i] = doubled > 9 ? doubled - 9 : doubled;
    }
    // get the total of amount of digits
    const sum = casted.reduce((a, b) => a + b, 0);

    // return the divisibility by 10
    return sum % 10 === 0 ? true : false;
  };

  /*
  ** Returns the caret (cursor) position of the specified text field (oField).
  ** Return value range is 0-oField.value.length.
  */
  getCursorPosition = (oField) => {
    // Initialize
    var iCaretPos = 0;

    // IE Support
    if (document.selection) {
      // Set focus on the element
      oField.focus();
      // To get cursor position, get empty selection range
      var oSel = document.selection.createRange();
      // Move selection start to 0 position
      oSel.moveStart('character', -oField.value.length);
      // The caret position is selection length
      iCaretPos = oSel.text.length;
    } else if (oField.selectionStart || oField.selectionStart === '0') {
      // Firefox support
      iCaretPos = oField.selectionDirection ==='backward' ? oField.selectionStart : oField.selectionEnd;
    }

    // Return results
    return iCaretPos;
  }

  /*
  ** Advance cursor to the next input after current input limit has been met.
  */
  smartCursor = (event) => {
    const el = event.target;
    const id = Number(el.id.slice(-1));
    const nextId = el.id.substring(0, el.id.length - 1) + (id + 1);
    
    
    if ([37,38,39,40].includes(event.keyCode)) {
      // Dont apply to arrow keys
      return;
    }else if (el.value.length === el.maxLength && id < 4) {
      // On reaching max chars, focus on next input if any.
      document.getElementById(nextId).focus();
    }
  };
  
  /**
  * Advance cursor to the next input after current input limit has been met.
  * @param {Object} event - DOM event that triggered this function.
  */
  smartTyping = (event) => {
    const el = event.target;
    const index = Number(el.id.slice(-1)) - 1;
    const card = this.state.card;
    const numbers = this.state.card.numbers;
    const cursorPosition = this.getCursorPosition(event.target);
    
    if (el.value.length === el.maxLength) {
      // End of the char limit on input
      return;
    }

    if (event.keyCode === 8) {
      // On backspace, remove digit relative to cursor position.
      const i = cursorPosition ? cursorPosition - 1: 0;
      numbers[index].length && numbers[index].splice(i, 1);
      card.numbers = numbers;
      this.setState({ card });
      return;
    }

    // Disable functionality of keys that are not integers.
    if (!event.key.match(/^[0-9]+$/)) return event.preventDefault();

    // Replace a digit if there are 4 numbers already. 
    const deleteCount = numbers[index].length === 4 ? 1 : 0;
    // Insert typed digit using cursor position as index. 
    numbers[index].splice(cursorPosition, deleteCount, event.key);
    card.numbers = numbers;
    this.setState({ card });

    setTimeout(() => {
      if (index === 0 && cursorPosition === 0) {
        // Detect card type after typing first char of first input
        this.detectCardType(el.value);
      }
      // Delay digit masking to give user glimpse of what they type. 
      // Mask every last letter with #.
      if (index < 3) el.value = el.value.slice(0, -1) + "#";
    }, 100);
  };

  render() {
    const {
      classes,
      user: { loading },
      UI: { alerts },
    } = this.props;
    const { errors, card } = this.state;

    return (
      <div>
        <div
          style={card.background}
          className={classes.creditCard}
        >
          <Typography align="right">
            <img className={classes.cardImage} src={card.image} />
          </Typography>
          <Grid container spacing={2} className="mt2">
            <Grid item xs={3}>
              <TextField
                required
                fullWidth
                variant="outlined"
                color="secondary"
                size="small"
                id="digit1"
                autoComplete={false}
                autoFill={false}
                onKeyUp={this.smartCursor}
                onKeyDown={this.smartTyping}
                value={this.state.digit1}
                error={Boolean(errors.digit1)}
                helperText={errors.digit1}
                inputProps={{ maxLength: 4 }}
                variant="filled"
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                required
                fullWidth
                variant="outlined"
                color="secondary"
                size="small"
                id="digit2"
                autoComplete={false}
                autoFill={false}
                onKeyUp={this.smartCursor}
                onKeyDown={this.smartTyping}
                value={this.state.digit2}
                error={Boolean(errors.digit2)}
                helperText={errors.digit2}
                inputProps={{ maxLength: 4 }}
                variant="filled"
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                required
                fullWidth
                variant="outlined"
                color="secondary"
                size="small"
                id="digit3"
                autoComplete={false}
                autoFill={false}
                onKeyUp={this.smartCursor}
                onKeyDown={this.smartTyping}
                value={this.state.digit3}
                error={Boolean(errors.digit3)}
                helperText={errors.digit3}
                inputProps={{ maxLength: 4 }}
                variant="filled"
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                required
                fullWidth
                variant="outlined"
                color="secondary"
                size="small"
                id="digit4"
                autoComplete={false}
                autoFill={false}
                onKeyUp={this.smartCursor}
                onKeyDown={this.smartTyping}
                value={this.state.digit4}
                error={Boolean(errors.digit4)}
                helperText={errors.digit4}
                inputProps={{ maxLength: 4 }}
                variant="filled"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} className="mt2">
            <Grid item xs={9}>
              <TextField
                required
                fullWidth
                variant="filled"
                label="Name on Card"
                id="name"
                autoComplete={false}
                autoFill={false}
                color="secondary"
                size="small"
                onBlur={this.validateHolderName}
                value={this.state.name}
                error={Boolean(errors.name)}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                required
                fullWidth
                variant="filled"
                id="date"
                label="Date"
                name="date"
                autoComplete="date"
                color="secondary"
                size="small"
                className={classes.textField}
                onBlur={this.validateCardDate}
                value={this.state.date}
                error={Boolean(errors.date)}
                helperText={errors.date}
              />
            </Grid>
          </Grid>
        </div>
        <Button fullWidth className={classes.payMtn} onClick={this.handleOpen}>
          <Typography variant="body1">MTN</Typography>
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="card-pay-form"
        >
          <DialogTitle id="card-pay-form">Authorize Payment</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please ensure you have your phone on you with sufficient balance
              in your account. We'll send you a prompt, please enter your pin to
              authorize payment.
            </DialogContentText>
            ..............................................................
          </DialogContent>
          {this.state.finished && alerts && (
            <Snackbar
              open={this.state.finished}
              autoHideDuration={3000}
              onClose={this.handleCloseAlert}
              message="hello"
            >
              <Alert variant="filled" severity={alerts.type}>
                {alerts.message}
              </Alert>
            </Snackbar>
          )}
          <DialogActions>
            <Button
              variant="contained"
              onClick={this.handleClose}
              color="default"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={this.handleSubmit}
              color="primary"
              disabled={loading}
            >
              {loading && (
                <CircularProgress className="progress-center" size={20} />
              )}
              Send prompt
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

creditCardButton.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  editUserDetails: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { editUserDetails })(
  withStyles(styles)(creditCardButton)
);
