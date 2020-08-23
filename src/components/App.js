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
    daySetting: 1
  };

  constructor(props) {
    super(props);
    this.state.players = DummyData;
  }

  loadData = async () => {
    const res = await axios.get('/players');
    this.setState({ players: res.data });
  }

  selectPlayer = (index) => {
    if (index >= 0 && index < this.state.players.length)
      this.setState((state) => ({ previous: state.visible, visible: index }));
  }

  toggleAutoScroll = () => {
    this.setState(prevState => ({ autoScroll: !prevState.autoScroll }));
  }

  handlePageChange = (page) => {
    this.setState({ page: page });
  }

  checkDaySettings(){
    if(this.state.player[0].mon === 'TBD'){
      this.setState({daySetting:0});
    }
    else if(this.state.player[0].wed === 'TBD'){
      this.setState({daySetting:1});
    }
    else if(this.state.player[0].fri === 'TBD'){
      this.setState({daySetting:2});
    }
  }

  changeDay = day => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>Are you sure?</h1>
            <p>You want to delete this file?</p>
            <button
              onClick={() => {
                // this.handleClickDelete();
                onClose();
              }}
            >
              Yes, Delete it!
            </button>
            <button onClick={onClose}>No</button>
          </div>
        );
      }
    });
    this.setState({daySetting:day});
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
              <Start changeDay={this.changeDay} daySetting={this.state.daySetting} spreadSheetId={this.state.spreadSheetId} autoScroll={this.state.autoScroll} toggleAutoScroll={this.toggleAutoScroll}/>
            </div>
            <div className="page page-1 container">
              <Progress page={this.state.page} players={this.state.players} points={this.state.players.length - 1} visible={this.state.visible} onPlayerSelect={this.selectPlayer} />
              <Carousel
                daySetting={this.state.daySetting}
                previous={this.state.previous}
                visible={this.state.visible}
                players={this.state.players}
                onPlayerChange={this.selectPlayer}
                autoScroll={this.state.autoScroll}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
