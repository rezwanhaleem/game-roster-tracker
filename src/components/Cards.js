import React from 'react';

import '../style/Cards.css';

class Cards extends React.Component {
  state = {
    selected1: '',
    selected2: '',
    selected3: ''
  };

  handleClick = (cardId) => {
    switch(cardId) {
      case 1:
        this.setState({selected1: 'selected', selected2: '', selected3: ''});
        break;
      case 2:
        this.setState({selected1: '', selected2: 'selected', selected3: ''});
        break;
      case 3:
        this.setState({selected1: '', selected2: '', selected3: 'selected'});
        break;
      default:
        break;
    } 
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 49 || e.keyCode === 70) {
      this.handleClick(1);
    }
    else if (e.keyCode === 50 || e.keyCode === 78) {
      this.handleClick(2);
    }
    else if (e.keyCode === 51 || e.keyCode === 66) {
      this.handleClick(3);
    }
  }

  handleVisibility = () => {
    if(this.props.visible) {
      document.addEventListener("keydown", this.handleKeyDown, false);
      return 'visible';
    }
    else {
      document.removeEventListener("keydown", this.handleKeyDown, false);
      return '';
    }
  }

  componentDidMount(){
    this.handleClick(this.getSelection(this.props.player.mon));
  }

  getSelection(data){
    let out;
    switch(data) {
      case 'Full':
        out = 1;
        break;
      case 'NO':
        out = 2;
        break;
      case 'Benched':
        out = 3;
        break;
      default:
        out = 2;
        break;
    } 
    return out;
  }

  render() {
    return (
      <section className={"Cards " + this.handleVisibility()}>
        <div className="container-fluid">
          <div className="container">
            <div className="row">
              <div className="col-sm-4">
                <div className={"card text-center "+ this.state.selected1} onClick={(e) => {
                  e.preventDefault();
                  this.handleClick(1);
                }}>
                  <div className="title">
                    <i className="fa fa-check-double" aria-hidden="true"></i>
                  </div>
                  <div className="price">
                    <h4>Full</h4>
                  </div>

                  <div className="checkbox"></div>
                </div>
              </div>
              {/* <!-- END Col one --> */}
              <div className="col-sm-4">
                <div className={"card text-center "+ this.state.selected2} onClick={(e) => this.handleClick(2)}>
                  <div className="title">
                    <i className="fa fa-times" aria-hidden="true"></i>
                  </div>
                  <div className="price">
                    <h4>No</h4>
                  </div>
                  <div className="checkbox"></div>
                </div>
              </div>
              {/* <!-- END Col two --> */}
              <div className="col-sm-4">
                <div className={"card text-center "+ this.state.selected3} onClick={(e) => this.handleClick(3)}>
                  <div className="title">
                    <i className="fa fa-couch" aria-hidden="true"></i>
                  </div>
                  <div className="price">
                    <h4>Benched</h4>
                  </div>
                  <div className="checkbox"></div>
                </div>
              </div>
              {/* <!-- END Col three --> */}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Cards;
