import React, { Component } from "react"
import './swipe_board.scss'

import NearbySearch from '../google_map_api/google_map_api';
import Hammer from 'hammerjs'
import ReactDOM from "react-dom";
import $ from 'jquery';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'

class BoardControl extends React.Component {
    render() {
        return (
            <div id="boardControl" className={this.props.display}>
                <div id="boardDislike" className="board-control-main-btn">
                    <FontAwesomeIcon icon={faThumbsDown} />
                </div>
                <div id="boardLike" className="board-control-main-btn">
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
        initialPosition: { x: 0, y: 0 }
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

        if (xloc > 150) {
            this.updateTransform(600, 0);
            $(ReactDOM.findDOMNode(this)).fadeOut();
        } else if (xloc < -150) {
            this.updateTransform(-600, 0);
            $(ReactDOM.findDOMNode(this)).fadeOut();
        } else {
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
            'transform': 'translate3d(' + x + 'px, ' + y + 'px, 0) rotate(' + (x / 10) + 'deg)',
            'opacity': 1 - (Math.abs(x) / 1000)
        });
    }

    render() {
        return (
            <div className="swipe-card">
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
                        <div className="place-photos-cont">
                            no photo
                        </div>
                    )}
                <div className="place-rating">{this.props.place.rating}</div>
            </div>
        );
    }
}

class SwipeBoard extends React.Component {
    state = {
        radius: 24140.2,    // ~ 15 miles
        nearbyResult: [],
    }

    updateNearbyResult = (result) => {
        console.log(result);

        this.setState({
            nearbyResult: result,
        })
    }

    render() {
        return (
            <div id="board">
                <NearbySearch radius={this.state.radius} updateNearbyResult={this.updateNearbyResult} />
                <div id="cards" className={this.state.nearbyResult.length > 0 ? "" : "d-none"}>
                    {this.state.nearbyResult.map((place) => {
                        return <SwipeCard key={place.place_id} place={place} />
                    })}
                </div>
                <BoardControl display={this.state.nearbyResult.length > 0 ? "" : "d-none"} />
            </div >
        );
    }
}

export default SwipeBoard;