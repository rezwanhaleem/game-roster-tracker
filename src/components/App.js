import React from 'react';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Nav from './Nav';
import Start from './Start';
import End from './End';
import Progress from './Progress';
import Carousel from './Carousel';
import DummyData from '../data/DummyData';
import '../style/App.css';

class App extends React.Component {
  state = {
    players: [],
    previous: 0,
    visible: 0,
    autoScroll: false,
    page: 0,
    spreadSheetId: '1OnJiwZHyYwq8HXSYi_Y7g7vGWDSbB_uuzrZBHvPXQH4',
    daySetting: 1,
    day: ['Monday', 'Wednesday', 'Friday'],
    isReset: false,
    loading: '',
    currentAssignment: []
  };

  updateCurrentAssignment() {
    let assignment = [];
    this.state.players.map((player) => {
      switch (this.state.daySetting) {
        case 0:
          assignment.push(player.mon);
          break;
        case 1:
          assignment.push(player.wed);
          break;
        case 2:
          assignment.push(player.fri);
          break;
        default:
          assignment.push('TBD');
          break;
      }
      this.setState({ currentAssignment: assignment });
      return 0;
    });
  }

  loadData = async () => {
    let res;

    this.setState({
      loading: 'fa-spin'
    }, async () => {
      try {
        res = await axios.get('/players');
        setTimeout(() => {
          this.setState({ players: res.data, loading: '' });
        }, 2000);
      }
      catch (err) {
        console.log(err);
        this.setState({ loading: '' });
      }
    });
  }

  selectPlayer = (index) => {
    if (index >= 0 && index < this.state.players.length)
      this.setState((state) => ({ previous: state.visible, visible: index }));
    else if (index >= this.state.players.length)
      this.handlePageChange(2);
  }

  toggleAutoScroll = () => {
    this.setState(prevState => ({ autoScroll: !prevState.autoScroll }));
  }

  handlePageChange = (page) => {
    this.setState({ page: page });
  }

  checkDaySettings() {
    if (this.state.player[0].mon === 'TBD') {
      this.setState({ daySetting: 0 }, this.updateCurrentAssignment);
    }
    else if (this.state.player[0].wed === 'TBD') {
      this.setState({ daySetting: 1 }, this.updateCurrentAssignment);
    }
    else if (this.state.player[0].fri === 'TBD') {
      this.setState({ daySetting: 2 }, this.updateCurrentAssignment);
    }
  }

  isAssigned(day) {
    if (day === 0) {
      if (this.state.player[0].mon === 'TBD')
        return false;
      else
        return true;
    }
    else if (day === 1) {
      if (this.state.player[0].wed === 'TBD')
        return false;
      else
        return true;
    }
    else if (day === 2) {
      if (this.state.player[0].fri === 'TBD')
        return false;
      else
        return true;
    }
  }

  changeDay = day => {
    if (day !== this.state.daySetting) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className='custom-ui'>
              <h1>Are you sure?</h1>
              <p>You want to edit {this.state.day[day]}? You have unsaved changes!</p>
              <div className='alert-container'>
                <button className="checkbox"
                  onClick={() => {
                    this.saveChanges();
                    this.setState({ daySetting: day }, this.updateCurrentAssignment);
                    onClose();
                  }}>
                  Save changes
                </button>
                <button className="checkbox"
                  onClick={() => {
                    this.setState({ daySetting: day }, this.updateCurrentAssignment);
                    onClose();
                  }}>
                  Discard changes
                </button>
                <button className="checkbox" onClick={onClose}>Cancel</button>
              </div>
            </div>
          );
        }
      });
    }
  }

  resetDays = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1 style={{ color: '#DB4437' }}>Are you sure?</h1>
            <p>You want to reassign this ENTIRE week?</p>
            <div className='alert-container'>
              <button style={{ color: '#DB4437' }} className="checkbox"
                onClick={() => {
                  let temp = this.state.players.slice();
                  temp.map((player) => {
                    player.mon = "TBD";
                    player.wed = "TBD";
                    player.fri = "TBD";
                    return 0;
                  });
                  this.setState({ isReset: true, players: temp });
                  onClose();
                }}>
                Yes
              </button>
              <button className="checkbox" onClick={onClose}>No</button>
            </div>
          </div>
        );
      }
    });
  }

  saveChanges = () => {
    let temp = this.state.players.slice();

    if (temp.length === 0) {
      return;
    }

    switch (this.state.daySetting) {
      case 0:
        temp.map((player, index) => {
          player.mon = this.state.currentAssignment[index];
          return 0;
        });
        break;
      case 1:
        temp.map((player, index) => {
          player.wed = this.state.currentAssignment[index];
          return 0;
        });
        break;
      case 2:
        temp.map((player, index) => {
          player.fri = this.state.currentAssignment[index];
          return 0;
        });
        break;
      default:
        break;
    }

    this.setState({ players: temp });
  }

  assignPlayer = (assignment, index) => {
    let tempAssign = this.state.currentAssignment.slice();

    if (tempAssign.length === 0) {
      return;
    }

    tempAssign[index] = assignment;

    this.setState({ currentAssignment: tempAssign });
  }

  savePlayerState = () => {
    // sessionStorage.setItem('appState', JSON.stringify(this.state));
  }

  componentDidUpdate(prevState) {
    if (this.state.player !== prevState.player) {
      this.checkDaySettings();
    }
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.savePlayerState);
    let appState = JSON.parse(sessionStorage.getItem('appState'));

    if (sessionStorage.getItem('appState') && appState.players.length > 0) {
      this.setState({
        players: appState.players,
        currentAssignment: appState.currentAssignment,
        daySetting: appState.daySetting,
        isReset: appState.isReset,
        autoScroll: appState.autoScroll,
        page: appState.page,
        visible: appState.visible
      })
    }
    else {
      this.setState({ players: DummyData }, this.updateCurrentAssignment);
    }
    
  }

  render() {
    const currentPage = {
      transform: "translateX(-" + (1 * this.state.page) + "00%)"
    };
    return (
      <div className="App">
        <Nav page={this.state.page} onPageChange={this.handlePageChange} />
        <div className="container">
          {/* <div className="loadData" onClick={this.loadData}>
            <i className="fa fa-download" aria-hidden="true"></i>
          </div> */}
          <div className="pages" style={currentPage}>
            <div className="page page-0">
              <Start
                changeDay={this.changeDay}
                resetDays={this.resetDays}
                daySetting={this.state.daySetting}
                spreadSheetId={this.state.spreadSheetId}
                autoScroll={this.state.autoScroll}
                toggleAutoScroll={this.toggleAutoScroll}
                loading={this.state.loading}
                loadData={this.loadData}
                changePage={this.handlePageChange}
              />
            </div>
            <div className="page page-1 container">
              <Progress
                page={this.state.page}
                players={this.state.players}
                points={this.state.players.length - 1}
                visible={this.state.visible}
                onPlayerSelect={this.selectPlayer}
              />
              <Carousel
                daySetting={this.state.daySetting}
                previous={this.state.previous}
                visible={this.state.visible}
                players={this.state.players}
                onPlayerChange={this.selectPlayer}
                autoScroll={this.state.autoScroll}
                isReset={this.state.isReset}
                assignPlayer={this.assignPlayer}
              />
            </div>
            <div className="page page-2">
              <End
                players={this.state.players}
                daySetting={this.state.daySetting}
                currentAssignment={this.state.currentAssignment}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
