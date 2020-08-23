import React from 'react';

class Start extends React.Component {
    render() {
        return (
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
                            <a className="external" target="_blank" rel="noopener noreferrer" href={"https://docs.google.com/spreadsheets/d/" + this.props.spreadSheetId + "/edit?usp=sharing"}><i className="fas fa-link"></i></a>
                        </div>
                        <div className="settings">
                            <div className="daySetting">
                                <div className={"day "+ (this.props.daySetting===0?'selected':'')} onClick={()=>this.props.changeDay(0)}>Mon</div>
                                <div className={"day "+ (this.props.daySetting===1?'selected':'')} onClick={()=>this.props.changeDay(1)}>Wed</div>
                                <div className={"day "+ (this.props.daySetting===2?'selected':'')} onClick={()=>this.props.changeDay(2)}>Fri</div>
                                <div className="reset"><i className="fas fa-undo" />Reset</div>
                            </div>
                            <div className="auto-scroll">
                                <div onClick={this.props.toggleAutoScroll}>
                                    <i className={"far fa-" + (this.props.autoScroll ? 'check-' : '') + "square"}></i>Auto Scroll
                        </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Start;