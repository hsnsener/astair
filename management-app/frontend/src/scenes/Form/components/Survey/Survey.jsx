import React, { Component } from "react";
import { Button, Card, CardBody } from "reactstrap";
import { Form, FormGroup, FormLabel, FormControl } from "react-bootstrap";
import axios from "axios";
import { get as getCookie, set as setCookie } from "es-cookie";

const urlServer = process.env.REACT_APP_ASTAIR_MANAGEMENT_BACKEND;
var vote_id, today, hour;
const baseYear = new Date(Date.UTC(2019, 0, 0, 0, 0, 0));

function diff_minutes(dt2, dt1) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}

function takeVoteId() {
  let now = new Date();
  vote_id = Math.floor(
    diff_minutes(now, baseYear) / process.env.REACT_APP_DURATION
  );
  return vote_id;
}

function saveDate() {
  today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  var h = today.getHours();
  var m = today.getMinutes();
  hour = h + ":" + m;

  today = dd + "/" + mm + "/" + yyyy;
  return today + "  " + hour;
}

class Survey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: "1",
      vote: "Hot"
    };
  }

  setVoteRegion(vote, region) {
    this.props.setVoteRegion(vote);
    this.props.setVoteRegion(region);
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };


  handleSubmit = event => {
    if (this.state.vote === "" || this.state.region === "") {
      console.log("Invalid choice please choose a valid option ");
    } else {
      setCookie("form_notification", "0");
      this.props.showNotification(false);
      var vote = takeVoteId();
      this.setState({ vote_id: vote });
      this.setVoteRegion(this.state.vote, this.state.region);
      this.setState({ state: this.state });
      this.props.raiseRefresh(false);
      this.postData();
    }
    event.preventDefault();
  };

  createForm() {
    return (
      <Card>
        <CardBody>
          <Form>
            <FormGroup>
              <FormLabel>Weather</FormLabel>
              <h5> How is the weather condition, how do you feel?</h5>
              <FormControl
                id="vote"
                value={this.state.vote}
                onChange={this.onChange}
                as="select"
              >
                <option value="Hot">Hot</option>
                <option value="Nice">Nice</option>
                <option value="Cold">Cold</option>
              </FormControl>
            </FormGroup>
            <FormGroup>
              <FormLabel> Region</FormLabel>
              <h5>What is your location in the office?</h5>
              <FormControl
                id="region"
                value={this.state.region}
                onChange={this.onChange}
                as="select"
              >
                <option value={1}>Region 1</option>
                <option value={2}>Region 2</option>
                <option value={3}>Region 3</option>
                <option value={4}>Region 4</option>
              </FormControl>
            </FormGroup>
          </Form>
          <Button type="submit" value="Submit" onClick={this.handleSubmit}>
            Submit
          </Button>
        </CardBody>
      </Card>
    );
  }

  render() {
    return <div>{this.createForm()}</div>;
  }
}

export default Survey;
