import React from 'react';

import '../style/Progress.css';

function Progress() {
    return (
        <div className="Progress">
            <section>
                <article>
                    <div class="chart">
                         <div class="bar bar-30 white">
                            <div class="face top">
                                <div class="growing-bar"></div>
                            </div>
                            <div class="face side-0">
                                <div class="growing-bar"></div>
                            </div>
                            <div class="face floor">
                                <div class="growing-bar"></div>
                            </div>
                            <div class="face side-a"></div>
                            <div class="face side-b"></div>
                            <div class="face side-1">
                                <div class="growing-bar"></div>
                            </div>
                        </div>
                    </div>
                </article>
            </section>
        </div>
    );
}

export default Progress;
