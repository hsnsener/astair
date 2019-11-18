import React, { Component } from "react";
import { showToast, hideToast } from "../../services/session/Toast/actions";
import { connect } from 'react-redux'
import {
  Modal,
  Button,
  Row,
  Col,
  Container,
  Form,
  Dropdown,
} from "react-bootstrap";

import ParticipantTable from "./components/Participants/participants";

class Dialog extends Component {
  state = {};
  participants = [];
  input;
  roomSelected = false;

  constructor(props) {
    super(props);
    this.state.currentRoom = "";
  }

  componentWillReceiveProps(newProps) {
    if (newProps.rooms.length === 1) {
      this.setState({ currentRoom: newProps.rooms[0] });
    }
  }

  convertTimeToString = t => {
    var hours = "";
    var minutes = "";
    if (t.hours < 10) {
      hours += "0";
    }
    hours += t.hours;
    if (t.minutes < 10) {
      minutes += "0";
    }
    minutes += t.minutes;
    return hours + ":" + minutes;
  };

  getTime = () => {
    if (!this.props.data.start) return "";
    const start = this.props.data.start;
    const end = this.props.data.end;

    return (
      this.convertTimeToString(start) + " - " + this.convertTimeToString(end)
    );
  };
  getDate = () => {
    if (!this.props.data.date) return "";
    const date = this.props.data.date;
    let str = date.day + "." + date.month + "." + date.year;
    return str;
  };

  updateParticipants = participants => {
    this.participants = new Set(participants);
  };

  getRooms = () => {
    return this.props.rooms.map(room => {
      return (
        <Dropdown.Item
          onClick={() => {
            this.roomSelected = true;
            this.setState({ currentRoom: room }, () => {
            });
          }}
          id={room}
        >
          {room}
        </Dropdown.Item>
      );
    });
  };

  getRoomHeader = () => {
    if (this.props.rooms.length === 1) {
      this.roomSelected = true;
      return "Room " + this.props.rooms[0];
    } else {
      if (this.roomSelected === false) {
        return "Select Room";
      } else {
        return "Room " + this.state.currentRoom;
      }
    }
  };

  handleCreateClick = () => {
    if (this.roomSelected === false) {
      this.props.onShowToast("danger", "Please select a room.");
      setTimeout(() => {
        this.props.onHideToast()
      }, 5000);
    } else {
      this.props.cancelCreating();
      this.props.onHide();
      const description = this.input.value;
      this.props.setDescription(description);
      this.props.onCreateMeeting(this.state.currentRoom);
      this.roomSelected = false;
      this.setState({ currentRoom: "" });
    }
  };

  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Meeting Preview
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h5>Creator: Serdar Gurbuz</h5>
          <Container style={{ marginTop: 20, marginBottom: 20 }}>
            <Row className="flex-row">
              <Col className="text-center align-self-center" xs={4}>
                Date: {this.getDate()}
              </Col>
              <Col className="text-center align-self-center" xs={4}>
                Time: {this.getTime()}
              </Col>
              <Col className="text-center" xs={4}>
                <Dropdown>
                  <Dropdown.Toggle variant="dark" id="dropdown-basic">
                    {this.getRoomHeader()}
                  </Dropdown.Toggle>

                  <Dropdown.Menu
                    style={{ maxHeight: "120px", overflowY: "auto" }}
                  >
                    {this.getRooms()}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          </Container>
          <Form>
            <Form.Group>
              <Form.Control
                ref={ref => {
                  this.input = ref;
                }}
                placeholder="Enter meeting description here..."
              />
            </Form.Group>
          </Form>

          <ParticipantTable
            data={this.props.allParticipants}
            updateParticipants={this.props.updateParticipants}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button
            onClick={() => {
              this.props.onHide();
              this.props.cancelCreating();
              this.setState({ currentRoom: "" });
            }}
            variant="danger"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              this.handleCreateClick();
            }}
          >
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStatetoProps = (state) => {
  return { data: state.toastReducer, error: state.error }
}

const mapDispatchprops = (dispatch) => {
  return {
    onShowToast: (level, message) => dispatch(showToast(level, message)),
    onHideToast: () => dispatch(hideToast())
  }
}

export default connect(mapStatetoProps, mapDispatchprops)(Dialog);
