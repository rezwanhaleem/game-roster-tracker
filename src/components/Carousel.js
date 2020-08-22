import React from 'react';

import Cards from './Cards';
import '../style/Carousel.css';

class Carousel extends React.Component {

    nextPlayer = () => {
        this.props.onPlayerChange(this.props.visible + 1);
    }

    prevPlayer = () => {
        this.props.onPlayerChange(this.props.visible - 1);
    }

    handleKeyDown = (e) => {
        if (e.keyCode === 37) {
            this.prevPlayer();
        }
        else if (e.keyCode === 39) {
            this.nextPlayer();
        }
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown, false);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown, false);
    }

    renderCards() {
        return this.props.players.map((player, index) => {
            return <Cards key={index} visible={(this.props.visible === index)} player={player} />;
        });
    };

    render() {
        const currentPosition = {
            transition: "transform " + (0.3 * Math.abs(this.props.previous - this.props.visible)) + "s",
            transform: "translateX(-" + (1 * this.props.visible) + "00%)"
        };
        return (
            <section className="Carousel">
                <div className="arrow arrow-previous" onClick={this.prevPlayer}>
                    <i className="fa fa-caret-left" aria-hidden="true"></i>
                </div>
                <div className="container">
                    <div className="carousel-content" style={currentPosition}>
                        {this.renderCards()}
                    </div>
                </div>
                <div className="arrow arrow-next" onClick={this.nextPlayer}>
                    <i className="fa fa-caret-right" aria-hidden="true"></i>
                </div>
            </section>
        );
    }
}

export default Carousel;