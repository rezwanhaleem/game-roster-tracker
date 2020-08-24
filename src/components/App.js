import React from 'react';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Nav from './Nav';
import Start from './Start';
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
    loading: ''
  };

  constructor(props) {
    super(props);
    this.state.players = DummyData;
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
    else if(index >= this.state.players.length)
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
      this.setState({ daySetting: 0 });
    }
    else if (this.state.player[0].wed === 'TBD') {
      this.setState({ daySetting: 1 });
    }
    else if (this.state.player[0].fri === 'TBD') {
      this.setState({ daySetting: 2 });
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
              <p>You want to edit {this.state.day[day]}?</p>
              <div className='alert-container'>
                <button className="checkbox"
                  onClick={() => {
                    this.setState({ daySetting: day });
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
                  let temp = this.state.players;
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

  componentDidUpdate(prevState) {
    if (this.state.player !== prevState.player) {
      this.checkDaySettings();
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
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
