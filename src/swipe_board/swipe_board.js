import React, { Component } from "react"
import './swipe_board.scss'

import NearbySearch from '../google_map_api/google_map_api';
import Hammer from 'hammerjs'
import ReactDOM from "react-dom";
import $ from 'jquery';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { faCookieBite } from '@fortawesome/free-solid-svg-icons'

class BoardControl extends React.Component {
    render() {
        return (
            <div id="boardControl" className={this.props.display}>
                <div id="boardDislike" className="board-control-main-btn cursor-pointer" onClick={this.props.triggerSwipe.bind(this, 'left')}>
                    <FontAwesomeIcon icon={faThumbsDown} />
                </div>
                <div id="boardLike" className="board-control-main-btn cursor-pointer" onClick={this.props.triggerSwipe.bind(this, 'right')}>
                    <FontAwesomeIcon icon={faThumbsUp} />
                </div>
            </div>
        );
    };
}

class SwipeCard extends React.Component {
    state = {
        x: 0,
        y: 0,
        initialPosition: { x: 0, y: 0 },
        swipeThreshold: 150,
    }

    componentDidMount() {
        this.card = $(ReactDOM.findDOMNode(this));

        this.setInitialPosition();

        this.hammer = new Hammer.Manager(ReactDOM.findDOMNode(this));
        this.hammer.add(new Hammer.Pan({ threshold: 2 }));

        this.hammer.on('panstart pancancel panmove panend', this.handlePan);
        this.hammer.on('swipestart swipeend swipecancel swipemove', this.handleSwipe);

        // this.resetPosition()
        // window.addEventListener('resize', this.resetPosition)
    }

    setInitialPosition() {
        const initialPosition = {
            x: Math.round(($('.App').innerWidth() - this.card.outerWidth(true)) / 2),
            y: Math.round(($('.App').innerHeight() - this.card.outerHeight(true)) / 2),
        };

        this.setState({ initialPosition });
    }

    triggerSwipe = (direction) => {
        let ev = {
            type: "panend",
            deltaX: direction == 'left' ? (-1 * (this.state.swipeThreshold + 10)) : this.state.swipeThreshold + 10,
        }

        this.panend(ev);
    }

    /*
     * pan handlers
    */
    handlePan = (ev) => {
        ev.preventDefault();
        if (!this.swiping) {
            this[ev.type](ev);
        }
        return false;
    }

    panstart = (ev) => {
        console.log(ev.type);
    }

    pancancel = (ev) => {
        console.log(ev.type);
    }

    panend = (ev) => {
        console.log(ev.type);

        // add smooth transition duration
        this.card.css('transition-duration', '0.3s');

        let xloc = ev.deltaX + this.state.initialPosition.x;

        if (xloc >= this.state.swipeThreshold) {        // swipe right
            this.updateTransform(500, 0);
            $(ReactDOM.findDOMNode(this)).fadeOut(() => {
                this.props.placeSelection("right");
            });
        } else if (xloc <= (this.state.swipeThreshold * -1)) {      // swipe left
            this.updateTransform(-500, 0);
            $(ReactDOM.findDOMNode(this)).fadeOut(() => {
                this.props.placeSelection("left");
            });
        } else {        // center
            this.updateTransform(0, 0);
        }
    }

    panmove = (ev) => {
        console.log(ev.type);

        // remove transition duration
        this.card.css('transition-duration', '0s');

        this.updateTransform(ev.deltaX + this.state.initialPosition.x, 0);
    }

    /*
     * swipe handlers
    */
    handleSwipe = (ev) => {
        console.log(ev.type);
    }

    updateTransform = (x = 0, y = 0) => {
        this.card.css({
            'transform': 'translate3d(' + x + 'px, ' + y + 'px, 0) rotate(' + (x / 10) + 'deg)'
        });

        this.card.find('.card-info').css({
            'opacity': 1 - (Math.abs(x) / 100)
        });

        let swipe_direction_cont = this.card.find('.card-swipe-direction');
        if (x > 0 && !swipe_direction_cont.hasClass('right')) {
            swipe_direction_cont.removeClass("left");
            swipe_direction_cont.addClass('right');
        } else if (x < 0 && !swipe_direction_cont.hasClass('left')) {
            swipe_direction_cont.removeClass("right");
            swipe_direction_cont.addClass('left');
        } else if (x == 0) {
            swipe_direction_cont.removeClass("right left");
        }
    }

    render() {
        return (
            <div className="swipe-card" style={{ zIndex: this.props.index }}>
                <div className="card-info">
                    <h1 className="place-name">{this.props.place.name}</h1>
                    {this.props.place.photos ? (
                        <div className="place-photos-cont">
                            {this.props.place.photos.map((photo, i) => {
                                var key = "photo-" + this.props.place.place_id;

                                return (
                                    <div key={key} className="place-photo">
                                        <img src={photo.getUrl()} alt={this.props.place.name} />
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                            <div className="place-photos-cont no-image">
                                <FontAwesomeIcon icon={faCookieBite} />
                                no image avaiable
                        </div>
                        )}
                    <div className="place-rating">{this.props.place.rating}</div>

                    <BoardControl triggerSwipe={this.triggerSwipe} />
                </div>

                <div className="card-swipe-direction">
                    <FontAwesomeIcon icon={faThumbsDown} className="direction-left" />
                    <FontAwesomeIcon icon={faThumbsUp} className="direction-right" />
                </div>
            </div>
        );
    }
}

class SwipeBoard extends React.Component {
    state = {
        radius: 24140.2,    // ~ 15 miles
        nearbyResult: [],
        indexCount: 1,
        placesRequest: {
            type: ['restaurant'],
            radius: 24140.2,        // default to ~ 15 miles
            keyword: 'Chinese'
        },
    }

    updateNearbyResult = (result) => {
        console.log(result);
        console.log(result.length);

        this.setState({
            nearbyResult: result,
            indexCount: this.state.indexCount + result.length,
        })
    }

    placeSelection = (swipe_direction) => {
        let nearbyResult = this.state.nearbyResult;

        if (swipe_direction == "left") {
            nearbyResult.splice(0, 1);
        }

        this.setState({
            nearbyResult: nearbyResult
        });
    }

    render() {
        return (
            <div id="board">
                <NearbySearch placesRequest={this.state.placesRequest} radius={this.state.radius} updateNearbyResult={this.updateNearbyResult} />
                <div id="cards" className={this.state.nearbyResult.length > 0 ? "" : "d-none"}>
                    {this.state.nearbyResult.map((place, index) => {
                        return <SwipeCard key={place.place_id} place={place} index={this.state.indexCount + this.state.nearbyResult.length - index} placeSelection={this.placeSelection} />
                    })}
                </div>
            </div >
        );
    }
}

export default SwipeBoard;