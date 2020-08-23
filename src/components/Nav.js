import React from 'react';

import '../style/Nav.css';

class Nav extends React.Component {
    state = {
        selected1: '',
        selected2: 'active',
        selected3: '',
        activeTop: 0,
        activeLeft: 0,
        activeHeight: 0,
        activeWidth: 0
    };

    handleClick = (e, tabId) => {
        switch (tabId) {
            case 1:
                this.setState({ selected1: 'active', selected2: '', selected3: '' });
                break;
            case 2:
                this.setState({ selected1: '', selected2: 'active', selected3: '' });
                break;
            case 3:
                this.setState({ selected1: '', selected2: '', selected3: 'active' });
                break;
            default:
                break;
        }

        let targ = e.currentTarget;
        this.setState({
            activeTop: targ.offsetTop,
            activeLeft: targ.offsetLeft,
            activeHeight: targ.offsetHeight + 1,
            activeWidth: targ.clientWidth
        });
    }

    init(e) {
        e.click()
    }

    render() {
        const horri = {
            top: this.state.activeTop + "px",
            left: this.state.activeLeft + "px",
            height: this.state.activeHeight + "px",
            width: this.state.activeWidth + "px"
        };
        return (
            <nav className="Nav navbar navbar-expand-lg navbar-mainbg">
                <div className="navbar-brand navbar-logo" >Guild War Tracker</div>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto">
                        <div className="hori-selector" style={horri}><div className="left"></div><div className="right"></div></div>
                        <li ref={this.init} className={"nav-item " + this.state.selected1} onClick={(e) => this.handleClick(e, 1)}>
                            <div className="nav-link" ><i className="fas fa-home"></i>Start</div>
                        </li>
                        <li className={"nav-item " + this.state.selected2} onClick={(e) => this.handleClick(e, 2)}>
                            <div className="nav-link" ><i className="fas fa-users"></i>Assign</div>
                        </li>
                        <li className={"nav-item " + this.state.selected3} onClick={(e) => this.handleClick(e, 3)}>
                            <div className="nav-link" ><i className="fas fa-file-upload"></i>Upload</div>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default Nav;