import React from 'react';

import Progress from './Progress';
import Carousel from './Carousel';
import '../style/App.css';

class App extends React.Component {
  state = {
    players: [1,3,1,1,2],
    previous: 0,
    visible: 0
  };

  selectPlayer = (index) => {
    if(index < this.state.players.length && index >= 0)
      this.setState((state) => ({previous: state.visible,visible:index}));
  }
  
  render() {
    return (
      <div className="App">
        <div className="container">
          <Progress points={this.state.players.length-1} visible={this.state.visible} onPlayerSelect={this.selectPlayer}/>
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
