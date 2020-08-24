import React from 'react';

import '../style/End.css';

class End extends React.Component {

    renderRows(){
        return this.props.players.map((player, index) => {
            return (
                <tr key={index}>
                    <th scope="row">{index}</th>
                    <td>{player.player}</td>
                    <td className="discord">{player.discord}</td>
                    <td>{}</td>
                    <td className={"" + (this.props.daySetting===0? "assigned":"")}>{this.props.daySetting===0? this.props.currentAssignment[index]:player.mon}</td>
                    <td className={"" + (this.props.daySetting===1? "assigned":"")}>{this.props.daySetting===1? this.props.currentAssignment[index]:player.wed}</td>
                    <td className={"" + (this.props.daySetting===2? "assigned":"")}>{this.props.daySetting===2? this.props.currentAssignment[index]:player.fri}</td>
                </tr>
            );
        });
    };

    render() {
        return (
            <div className="End container">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">Name</th>
                            <th scope="col" className="discord"><i className="fab fa-discord"></i>Discord Tag</th>
                            <th scope="col"></th>
                            <th scope="col" className={"" + (this.props.daySetting===0? "assigned":"")}>Mon</th>
                            <th scope="col" className={"" + (this.props.daySetting===1? "assigned":"")}>Wed</th>
                            <th scope="col" className={"" + (this.props.daySetting===2  ? "assigned":"")}>Fri</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderRows()}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default End;