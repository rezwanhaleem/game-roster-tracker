import React from 'react';
import axios from 'axios';

import Progress from './Progress';
import Carousel from './Carousel';
import '../style/App.css';

class App extends React.Component {
  state = {
    players: [
      {
        player: 'Rez',
        discord: 'Trash',
        mon:'Full'
      },
      {
        player: 'Steven',
        discord: 'SoftFluff',
        mon:'Benched'
      },
      {
        player: 'Quan',
        discord: 'Twice',
        mon:'Full'
      },
      {
        player: 'Raymond',
        discord: 'Momo',
        mon:'Full'
      },
      {
        player: 'Eric',
        discord: 'Omo',
        mon:'NO'
      }],
    previous: 0,
    visible: 0
  };

  loadData = async () => {
    const res = await axios.get('/players');
    this.setState({players:res.data});
  }

  selectPlayer = (index) => {
    if(index < this.state.players.length && index >= 0)
      this.setState((state) => ({previous: state.visible,visible:index}));
  }
  
  render() {
    return (
      <div className="App">
        <div className="container">
          <div className="loadData" onClick={this.loadData}>
            <i className="fa fa-download" aria-hidden="true"></i>
          </div>
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
