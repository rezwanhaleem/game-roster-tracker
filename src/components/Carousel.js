import React from 'react';

import Cards from './Cards';
import '../style/Carousel.css';

class Carousel extends React.Component {

    renderCards(){
        return this.props.players.map((player, index)=>{
            return <Cards key={index} visible={(this.props.visible===index)} player={player}/>;
        });
    };

    render() {
        return(
            <section className="Carousel">
                {this.renderCards()}
            </section>
        );
    }
}

export default Carousel;