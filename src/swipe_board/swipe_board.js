import React, { Component } from "react"
import './swipe_board.scss'

import NearbySearch from '../google_map_api/google_map_api';

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