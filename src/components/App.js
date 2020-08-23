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
    visible: 0
  };

  constructor(props){
    super(props);
    this.state.players = DummyData;
  }

  loadData = async () => {
    const res = await axios.get('/players');
    this.setState({players:res.data});
  }

  selectPlayer = (index) => {
    if(index >= 0 && index < this.state.players.length)
      this.setState((state) => ({previous: state.visible,visible:index}));
  }
  
  render() {
    return (
      <div className="App">
        <Nav />
        <div className="container">
          {/* <div className="loadData" onClick={this.loadData}>
            <i className="fa fa-download" aria-hidden="true"></i>
          </div> */}
          <Progress players={this.state.players} points={this.state.players.length-1} visible={this.state.visible} onPlayerSelect={this.selectPlayer}/>
          <Carousel 
            previous={this.state.previous} 
            visible={this.state.visible} 
            players={this.state.players} 
            onPlayerChange={this.selectPlayer}
            />
        </div>
      </div>
    );
  }
}

export default App;
