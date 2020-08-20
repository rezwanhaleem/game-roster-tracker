import React from 'react';

import Cards from './Cards';
import '../style/Carousel.css';

class Carousel extends React.Component {

    renderCards() {
        return this.props.players.map((player, index) => {
            return <Cards key={index} visible={(this.props.visible === index)} player={player} />;
        });
    };

    render() {
        const currentPosition = {
            transition: "transform " + (0.3*Math.abs(this.props.previous-this.props.visible)) + "s",
            transform: "translateX(-" + (1*this.props.visible) +"00%)"
        };
        return (
            <section className="Carousel" style={currentPosition}>
                {this.renderCards()}
            </section>
        );
    }
}

export default Carousel;