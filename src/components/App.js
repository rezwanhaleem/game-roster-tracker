import React from 'react';
import axios from 'axios';

import Nav from './Nav';
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
    page: 0
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
    this.setState(prevState => ({autoScroll: !prevState.autoScroll}));
  }

  handlePageChange = (page) => {
    this.setState({ page: page });
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
              <div className="start card text-center">
                <div className="bg-container">
                  <div>
                    <svg viewBox="0 0 100 15">
                      <path fill="#5161ce" d="M0 30 V12 Q30 17 55 12 T100 11 V30z" />
                    </svg>
                  </div>
                  <div className='bg-overlay'>
                    <div className="price">
                      <h4>Setup your tracker</h4>
                    </div>
                    <div className="settings">
                      <div className="daySetting">
                        <div className="day">Mon</div>
                        <div className="day">Wed</div>
                        <div className="day">Fri</div>
                        <div className="reset"><i className="fas fa-undo"/>Reset</div>
                      </div>
                      <div className="auto-scroll">
                        <div onClick={this.toggleAutoScroll}>
                          <i className={"far fa-" + (this.state.autoScroll? 'check-':'') + "square"}></i>Auto Scroll
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="page page-1 container">
              <Progress page={this.state.page} players={this.state.players} points={this.state.players.length - 1} visible={this.state.visible} onPlayerSelect={this.selectPlayer} />
              <Carousel
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
