import React, { Component } from "react"
import './swipe_board.scss'

import Firebase from "firebase";
import firebaseConfig from "../config";

import CustomNavbar from '../navbar/navbar';

import NearbySearch from '../google_map_api/google_map_api';
import Hammer from 'hammerjs'
import ReactDOM from "react-dom";
import $ from 'jquery';

import Spinner from 'react-bootstrap/Spinner';
import { Row, Col } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown, faThumbsUp, faCookieBite, faCheck, faAngleDoubleRight, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';

const google = window.google;
const GOOGLE_API_KEY = "AIzaSyCFDZdtTK1ZsatLNERYCI2U_yoXcZIXeDk"

const numLoad = 3;                  // number of photos or cards loads at a time
const photoSwitchTime = 4000;       // 4 second
const swipeThreshold = 150;         // x distance need to move for the card to register as a like or dislike
const swipeDistance = 600;          // distance to manually trigger swipe when click on like or dislike buttons

class ToastMessage extends React.Component {
    render() {
        return (
            <Toast className={this.props.messageType} onClose={() => { this.props.setToastMessage() }} show={this.props.show} delay={3000} autohide >
                <Toast.Header>
                    <strong className="mr-auto">{this.props.messageType}</strong>
                </Toast.Header>
                <Toast.Body>{this.props.message}</Toast.Body>
            </Toast >
        );
    }
}

class LoadingOverlay extends React.Component {
    componentDidUpdate = () => {
        let overlay = $(ReactDOM.findDOMNode(this));
        if (this.props.showLoading) {
            overlay.fadeIn();
        } else {
            overlay.fadeOut();
        }
    }

    render() {
        return (
            <Row id="loadingOverlay" className="no-gutters" >
                <Col>
                    <Row>
                        <Col>
                            <Spinner animation="border" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>loading</Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}

class MostLikedPlace extends React.Component {
    componentDidMount = () => {
        setTimeout(() => { this.photoSwitch() }, photoSwitchTime);
    }

    photoSwitch = () => {
        let curPhoto = $('.place-photo img.show');
        let nextPhoto = curPhoto.next().length == 0 ? $('.place-photo img').first() : curPhoto.next();
        let nextNextPhoto = curPhoto.next().next();

        curPhoto.fadeOut().removeClass('show');
        nextPhoto.fadeIn().addClass('show');

        if (!nextNextPhoto.hasClass('loaded')) {
            nextNextPhoto.attr('src', nextNextPhoto.data('src'))
                .addClass('loaded');
        }

        setTimeout(() => { this.photoSwitch() }, photoSwitchTime);
    }

    render() {
        return (
            <Row id="resultPlace" className="no-gutters">
                <Col>
                    {/* Photos */}
                    <Row className="place-photo">
                        <Col>
                            {this.props.mostLiked.photos.map((photo, i) => {
                                return (
                                    <img
                                        key={i}
                                        src={i < numLoad ? photo.getUrl() : ''}
                                        alt={this.props.mostLiked.name}
                                        className={(i < numLoad ? 'loaded' : '') + (i == 0 ? ' show' : '')}
                                        data-src={photo.getUrl()}
                                    />
                                );
                            })}
                        </Col>
                    </Row>
                    <Row>
                        <Col className="place-name">{this.props.mostLiked.name}</Col>
                    </Row>

                    {/* Phone Number */}
                    {this.props.mostLiked.formatted_phone_number ? (
                        <Row className="place-phone-number">
                            <Col>
                            </Col>
                        </Row>
                    ) : (
                            null
                        )}

                    <Row className="result-bottom-sec">
                        <Col>
                            {/* Phone Number */}
                            <a href={"tel:" + this.props.mostLiked.formatted_phone_number}
                                className="btn btn-primary cursor-pointer phone-number">
                                <FontAwesomeIcon icon={faPhoneAlt} />
                            </a>

                            {/* Address */}
                            <a href={"http://maps.apple.com/?address=" + this.props.mostLiked.formatted_address}
                                className="btn btn-primary cursor-pointer">
                                <span className="colored-text">direction</span><FontAwesomeIcon icon={faAngleDoubleRight} />
                            </a>
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}

class BoardControl extends React.Component {
    render() {
        return (
            <div id="boardControl" className={this.props.display}>
                <div id="boardDislike" className="board-control-main-btn cursor-pointer" onClick={this.props.triggerSwipe.bind(this, 'left')}>
                    <FontAwesomeIcon icon={faThumbsDown} />
                </div>
                {this.props.hasLikes ? (
                    <div id="boardDone" className="board-control-main-btn cursor-pointer" onClick={() => { this.props.doneSwipe() }}>
                        <span className="colored-text">done</span>
                    </div>
                ) : (
                        null
                    )}
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
    }

    componentDidMount() {
        this.card = $(ReactDOM.findDOMNode(this));

        this.setInitialPosition();

        this.hammer = new Hammer.Manager(ReactDOM.findDOMNode(this));
        this.hammer.add(new Hammer.Pan({ threshold: 2 }));

        this.hammer.on('panstart pancancel panmove panend', this.handlePan);
        this.hammer.on('swipestart swipeend swipecancel swipemove', this.handleSwipe);
    }

    setInitialPosition = () => {
        const initialPosition = {
            x: Math.round(($('#cards').innerWidth() - this.card.outerWidth(true)) / 2),
            y: Math.round(($('#cards').innerHeight() - this.card.outerHeight(true)) / 2),
        };

        this.setState({ initialPosition });
    }

    triggerSwipe = (direction) => {
        let ev = {
            type: "panend",
            deltaX: direction == 'left' ? (-1 * swipeThreshold) : swipeThreshold,
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

        if (xloc >= swipeThreshold) {        // swipe right
            this.updateTransform(swipeDistance, 0);
            this.card.fadeOut(() => {
                this.props.placeSelection("right");
            });
            this.card.css('transition-duration', '');
        } else if (xloc <= (swipeThreshold * -1)) {      // swipe left
            this.updateTransform(swipeDistance * -1, 0);
            this.card.fadeOut(() => {
                this.props.placeSelection("left");
            });
            this.card.css('transition-duration', '');
        } else {        // center
            this.updateTransform(0, 0);
            this.card.find('#boardControl').fadeIn();
        }
    }

    panmove = (ev) => {
        console.log(ev.type);

        // remove transition duration
        this.card.css('transition-duration', '');

        this.updateTransform(ev.deltaX + this.state.initialPosition.x, 0);
    }

    /*
     * swipe handlers
    */
    handleSwipe = (ev) => {
        console.log(ev.type);
    }

    updateTransform = (x = 0, y = 0) => {
        // hide the button controls
        this.card.find('#boardControl').fadeOut();

        this.card.css({
            'transform': 'translate3d(' + x + 'px, ' + y + 'px, 0) rotate(' + (x / 10) + 'deg)',
        });

        this.card.find('.card-info').css({
            'opacity': 1 - (Math.abs(x) / 100)
        });

        // switch between like and dislike background
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

                    <BoardControl
                        triggerSwipe={this.triggerSwipe}
                        doneSwipe={this.props.doneSwipe}
                        hasLikes={this.props.hasLikes}
                    />
                </div>

                <div className="card-swipe-direction">
                    <FontAwesomeIcon icon={faThumbsDown} className="direction-left" />
                    <FontAwesomeIcon icon={faThumbsUp} className="direction-right" />
                </div>
            </div>
        );
    }
}

class Cards extends React.Component {
    render() {
        let selectedNearbyResult = [];
        let nearbyResult = this.props.nearbyResult;
        if (nearbyResult && nearbyResult.length > 0) {
            let loopTo = nearbyResult.length > numLoad ? numLoad : nearbyResult.length;

            for (var i = 0; i < loopTo; i++) {
                selectedNearbyResult.push(this.props.nearbyResult[i]);
            }
        }

        if (this.props.uuid) {    // if swiping
            if (selectedNearbyResult.length > 0) {  // if have cards to swipe
                return (
                    <div id="cards">
                        {selectedNearbyResult.map((place, index) => {
                            return <SwipeCard
                                key={place.place_id}
                                place={place}
                                index={this.props.indexCount + selectedNearbyResult.length - index}
                                placeSelection={this.props.placeSelection}
                                doneSwipe={this.props.doneSwipe}
                                hasLikes={this.props.hasLikes}
                            />
                        })}
                    </div>
                );
            } else if (this.props.pagination && this.props.pagination.hasNextPage) {  // if still have more pages
                return (
                    <div id="cardLoader">
                        <Spinner animation="border" />
                        <div>loading more places</div>
                    </div>
                );
            } else { // no more card to swipe
                return (
                    <div id="noCards">
                        <FontAwesomeIcon icon={faCheck} />
                        <div>you are done!</div>
                    </div>
                );
            }
        } else {
            return null;
        }
    }
}

class SwipeBoard extends React.Component {
    constructor(props) {
        super(props);
        if (!Firebase.apps.length) {
            Firebase.initializeApp(firebaseConfig);
        }

        this.state = {
            uuid: null,
            nearbyResult: [],
            indexCount: 1,
            placesRequest: {
                type: ['restaurant'],
                radius: 16093.4,        // 16093.4 meters ~ 10 miles
                keyword: '',
                minprice: 0,
                maxprice: 4,            // price range from 0 ~ 4, with 0 been most affordable and 4 been most expensive
                openNow: true,
            },
            mostLiked: null,
            hasLikes: false,
            showLoading: false,
            showToast: false,
            ToastMessageType: '',
            ToastMessage: '',
        }
    }


    componentDidUpdate = () => {
        if ((this.state.nearbyResult && this.state.nearbyResult.length == 0) && (this.state.pagination != null && this.state.pagination.hasNextPage)) {
            this.setState({
                nearbyResult: this.state.pagination.nextPage()
            })
        }

        if (this.state.likedPlaces && this.state.mostLiked == null) {
            this.getResult();
        }
    }

    resetBoard = () => {
        this.setState({
            uuid: null,
            nearbyResult: [],
            indexCount: 1,
            placesRequest: {
                type: ['restaurant'],
                radius: 16093.4,        // 16093.4 meters ~ 10 miles
                keyword: '',
                minprice: 0,
                maxprice: 4,
                openNow: true,
            },
            pagination: null,
        });
    }

    getResult = () => {
        let likedPlaces = this.state.likedPlaces;
        let mostLiked = likedPlaces[Object.keys(likedPlaces)[0]];
        let mostLikedPlaceId = Object.keys(likedPlaces)[0];

        Object.keys(likedPlaces).forEach((k) => {
            let place = likedPlaces[k];

            if (place.likes > mostLiked.likes) {
                mostLikedPlaceId = k;
            }
        });

        const service = new window.google.maps.places.PlacesService(document.createElement('div'));
        service.getDetails({
            key: GOOGLE_API_KEY,
            placeId: mostLikedPlaceId
        }, (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                this.setState({
                    mostLiked: place
                });
            }
        });
    }

    doneSwipe = () => {
        let ref = Firebase.database().ref("/" + this.state.uuid);
        let reactScope = this;

        ref.once('value', function (snapshot) {
            let likedPlaces = snapshot.val().places;
            if (likedPlaces) {
                reactScope.setState({
                    likedPlaces: likedPlaces
                })
            }
        });
    }

    setGroupID = (lat, lng) => {
        let uuid = Math.floor(Math.random() * 90000) + 10000;
        let ref = Firebase.database().ref("/");
        let reactScope = this;

        ref.child(uuid).once('value', function (snapshot) {
            if (snapshot.exists()) {
                return this.setGroupID(lat, lng);
            } else {
                let ref2 = Firebase.database().ref(uuid);
                let date = new Date();

                ref2.set({
                    lat: lat,
                    lng: lng,
                    created_on: date.toLocaleString(),
                });

                // return uuid;
                reactScope.setState({
                    uuid: uuid
                })
            }
        });
    }

    updateNearbyResult = (lat, lng, result, pagination, groupID = null) => {
        // generate new/unique uuid
        if (!groupID) this.setGroupID(lat, lng);

        this.setState({
            uuid: groupID,   // temporarily set uuid for testing purpose
            nearbyResult: result,
            indexCount: this.state.indexCount + result.length,
            pagination: pagination != null && pagination.hasNextPage ? pagination : null,
            showLoading: false,
        });
    }

    updateLike = (place) => {
        let ref = Firebase.database().ref(this.state.uuid);
        let reactScope = this;

        if (ref) {
            ref.once('value', snapshot => {
                let val = snapshot.val();
                let placeID = place.place_id;

                // if the places container object doesn't exist, create one
                if (!val.places) {
                    val.places = {};
                }

                // if the place exist
                if (val.places[placeID]) {
                    val.places[placeID].likes++;
                } else {
                    val.places[placeID] = {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                        likes: 1,
                    };
                }

                ref.set(val);
                console.log(reactScope.state.hasLikes);
                if (!reactScope.state.hasLikes) {
                    reactScope.setState({
                        hasLikes: true,
                    });
                }
            });
        }
    }

    placeSelection = (swipe_direction) => {
        let nearbyResult = this.state.nearbyResult;

        if (swipe_direction == "right") {
            this.updateLike(this.state.nearbyResult[0]);
        }

        nearbyResult.shift();

        this.setState({
            nearbyResult: this.state.nearbyResult
        });
    }

    updateFilters = (filters) => {
        let placesRequest = this.state.placesRequest;
        placesRequest.radius = filters.radius;
        placesRequest.keyword = filters.keyword;

        this.setState({
            placesRequest: placesRequest
        })

        this.setToastMessage('success', 'search filter updated');
    }

    toggleLoadingOverlay = (show) => {
        this.setState({
            showLoading: show
        });
    }

    setToastMessage = (messageType, message) => {
        this.setState({
            showToast: (this.state.showToast && message == null) ? false : true,
            ToastMessageType: messageType,
            ToastMessage: message,
        })
    }

    render() {
        return (
            <div id="board">
                <LoadingOverlay showLoading={this.state.showLoading} />
                <ToastMessage
                    show={this.state.showToast}
                    messageType={this.state.ToastMessageType}
                    message={this.state.ToastMessage}
                    setToastMessage={this.setToastMessage}
                />
                <CustomNavbar
                    resetBoard={this.resetBoard}
                    uuid={this.state.uuid}
                    placesRequest={this.state.placesRequest}
                    updateFilters={this.updateFilters}
                />
                {this.state.mostLiked == null ? (
                    <>
                        <Cards
                            uuid={this.state.uuid}
                            pagination={this.state.pagination}
                            nearbyResult={this.state.nearbyResult}
                            indexCount={this.state.indexCount}
                            hasLikes={this.state.hasLikes}
                            placeSelection={this.placeSelection}
                            doneSwipe={this.doneSwipe}
                        />
                        <NearbySearch
                            uuid={this.state.uuid}
                            placesRequest={this.state.placesRequest}
                            updateNearbyResult={this.updateNearbyResult}
                            toggleLoadingOverlay={this.toggleLoadingOverlay}
                            setToastMessage={this.setToastMessage}
                        />
                    </>
                ) : (
                        <MostLikedPlace mostLiked={this.state.mostLiked} />
                    )}
            </div>
        )
    }
}

export default SwipeBoard;