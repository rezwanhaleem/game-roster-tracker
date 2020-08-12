import React from 'react';

import '../style/Cards.css';

class Cards extends React.Component {
  state = {
    keyPressed1: '',
    keyPressed2: '',
    keyPressed3: ''
  };

  handleKeyDown = (e) => {
    if (e.keyCode === 49 || e.keyCode === 70) {
      this.setState({keyPressed1: 'key-pressed'});
      setTimeout(() => { 
        this.setState({keyPressed1: ''});
      }, 400);
    }
    else if (e.keyCode === 50 || e.keyCode === 78) {
      this.setState({keyPressed2: 'key-pressed'});
      setTimeout(() => { 
        this.setState({keyPressed2: ''});
      }, 400);
    }
    else if (e.keyCode === 51 || e.keyCode === 66) {
      this.setState({keyPressed3: 'key-pressed'});
      setTimeout(() => { 
        this.setState({keyPressed3: ''});
      }, 400);
    }
  }

  componentDidMount(){
    document.addEventListener("keydown", this.handleKeyDown, false);
  }

  componentWillMount(){
    document.removeEventListener("keydown", this.handleKeyDown, false);
  }

  render() {
    return (
      <section className="Cards">
        <div className="container-fluid">
          <div className="container">
            <div className="row">
              <div className="col-sm-4">
                <div className={"card text-center "+ this.state.keyPressed1}>
                  <div className="title">
                    <i className="fa fa-check-double" aria-hidden="true"></i>
                  </div>
                  <div className="price">
                    <h4>Full</h4>
                  </div>

                  <a href="#"></a>
                </div>
              </div>
              {/* <!-- END Col one --> */}
              <div className="col-sm-4">
                <div className={"card text-center "+ this.state.keyPressed2}>
                  <div className="title">
                    <i className="fa fa-times" aria-hidden="true"></i>
                  </div>
                  <div className="price">
                    <h4>No</h4>
                  </div>
                  <a href="#"></a>
                </div>
              </div>
              {/* <!-- END Col two --> */}
              <div className="col-sm-4">
                <div className={"card text-center "+ this.state.keyPressed3}>
                  <div className="title">
                    <i className="fa fa-couch" aria-hidden="true"></i>
                  </div>
                  <div className="price">
                    <h4>Benched</h4>
                  </div>
                  <a href="#"></a>
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
