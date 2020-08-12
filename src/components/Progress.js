import React from 'react';

import '../style/Progress.css';

class Progress extends React.Component{
    state = {Animate: 'anim'};

    componentDidMount(){
        setTimeout(() => { 
            this.setState({Animate: ''});
        }, 2000);
    }

    render() {
        return (
            <div className="Progress">
                <section>
                    <article>
                        <div className="chart">
                            <div className={"bar bar-30 white "+ this.state.Animate}>
                                <div className="face top">
                                    <div className="growing-bar"></div>
                                </div>
                                <div className="face side-0">
                                    <div className="growing-bar"></div>
                                </div>
                                <div className="face floor">
                                    <div className="growing-bar"></div>
                                </div>
                                <div className="face side-a"></div>
                                <div className="face side-b"></div>
                                <div className="face side-1">
                                    <div className="growing-bar"></div>
                                </div>
                            </div>
                        </div>
                    </article>
                </section>
            </div>
        );

    }
}

export default Progress;
