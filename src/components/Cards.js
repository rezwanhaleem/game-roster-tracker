import React from 'react';

import '../style/Cards.css';

function Cards() {
  return (
    <section className="Cards">
      <div className="container-fluid">
        <div className="container">
          <div className="row">
            <div className="col-sm-4">
              <div className="card text-center">
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
              <div className="card text-center">
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
              <div className="card text-center">
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

export default Cards;
