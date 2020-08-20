import React from 'react';

import Progress from './Progress';
import Carousel from './Carousel';
import '../style/App.css';

class App extends React.Component {
  state = {
    players: [1,3,1,1,2],
    visible: 0
  };

  selectPlayer = (index) => {
    this.setState({visible:index});
  }
  
  render() {
    return (
      <div className="App">
        <div className="container">
          <Progress points={this.state.players.length-1} onPlayerSelect={this.selectPlayer}/>
          <Carousel visible={this.state.visible} players={this.state.players} />
        </div>
      </div>
    );
  }
}

export default App;
