import React, { Component, useState } from "react"
import './google_map_api.scss'

import Firebase from "firebase";
import firebaseConfig from "../config";

import ReactGoogleMapLoader from "react-google-maps-loader"
import ReactGooglePlacesSuggest from "react-google-places-suggest"

import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow, faUsers, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons'
import { Row, Col } from "react-bootstrap";

const GOOGLE_API_KEY = "AIzaSyCFDZdtTK1ZsatLNERYCI2U_yoXcZIXeDk"

class JoinGroup extends React.Component {
    constructor(props) {
        super(props);
        if (!Firebase.apps.length) {
            Firebase.initializeApp(firebaseConfig);
        }

        this.state = {
            groupIDLength: 5,
            groupID: '',
            show: false,
            messageType: '',
            message: '',
        };
    }

    getGroupNumber = (e) => {
        e.preventDefault(process.env.REACT_APP_FIREBASE_PRIVATE_KEY);

        if (this.state.groupID.length == this.state.groupIDLength) {
            let ref = Firebase.database().ref("/" + this.state.groupID);

            ref.on("value", snapshot => {
                const val = snapshot.val();
                if (val == null) {
                    this.setShow("error", "The group ID does not exist.");
                } else {
                    this.props.fetchNearby("", val.lat, val.lng);
                }
            });
        } else {
            this.setShow("error", "Invalid number of digits.");
        }
    }

    handleInputChange = (e) => {
        this.setState({
            groupID: e.target.value
        });
    }

    setShow = (messageType, message) => {
        this.setState({
            show: this.state.show ? false : true,
            messageType: messageType,
            message: message,
        })
    }

    render() {
        return (
            <form onSubmit={this.getGroupNumber}>
                <Toast className={this.state.messageType} onClose={() => { this.setShow() }} show={this.state.show} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="mr-auto">Error</strong>
                    </Toast.Header>
                    <Toast.Body>{this.state.message}</Toast.Body>
                </Toast>

                <Row>
                    <Col>
                        <Row>
                            <Col>
                                <h1>
                                    <FontAwesomeIcon icon={faUsers} />
                                </h1>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <input
                                    type="number"
                                    className="text-input"
                                    placeholder={"enter " + this.state.groupIDLength + " digit group id"}
                                    onChange={this.handleInputChange}
                                    value={this.state.group_id}
                                    required
                                    autoComplete="off"
                                    maxLength={this.state.groupIDLength}
                                />
                            </Col>
                            <Col md={12}>
                                <input type="submit" className="btn-primary" value="join" />
                            </Col>
                            <Col md={12}>
                                <Button variant="secondary" onClick={this.props.toggleGetGroup}>cancel</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </form >
        );
    }
}

class CurrentLocation extends React.Component {
    getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition);
        } else {
            console.log("Geolocation is not supported by this browser");
        }
    }

    showPosition = (position) => {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        console.log("Latitude: " + lat + " Longitude: " + lng);

        this.props.fetchNearby("", lat, lng);
    }

    render() {
        return (
            <button id="currentLocation" className="btn btn-primary" onClick={this.getLocation}>
                locate me
                <FontAwesomeIcon icon={faLocationArrow} />
            </button>
        );
    }
}

class GoogleSuggest extends React.Component {
    state = {
        search: "",
        value: "",
        status: "",
    }

    componentDidUpdate(prevProps, prevState) {
        // status change
        if (prevState.status !== this.state.status && this.state.status != "" && document.getElementsByClassName('sc-EHOje').length > 0) {
            if (this.state.status == window.google.maps.places.PlacesServiceStatus.OK) {
                document.getElementsByClassName('sc-EHOje')[0].classList.remove('invalid');
            } else {
                document.getElementsByClassName('sc-EHOje')[0].classList.add('invalid');
            }
        }
    }

    handleInputChange = e => {
        console.log(e);

        this.setState({
            search: e.target.value,
            value: e.target.value
        });
    }

    handleSelectSuggest = (geocodedPrediction, originalPrediction) => {
        console.log(geocodedPrediction, originalPrediction) // eslint-disable-line

        this.props.fetchNearby(
            geocodedPrediction.formatted_address,
            geocodedPrediction.geometry.location.lat(),
            geocodedPrediction.geometry.location.lng()
        );

        this.setState({
            search: "",
            value: geocodedPrediction.formatted_address,
        });
    }

    handleNoResult = () => {
        console.log("No results for ", this.state.search);
    }

    handleStatusUpdate = status => {
        console.log(status);

        if (status != this.state.status) {
            this.setState({
                status: status,
            });
        }
    }

    getLatLng = () => {
        return
    }

    render() {
        const { search, value } = this.state
        return (
            <ReactGoogleMapLoader
                params={{
                    key: GOOGLE_API_KEY,
                    libraries: "places,geocoded",
                }}
                render={googleMaps =>
                    googleMaps && (
                        <ReactGooglePlacesSuggest
                            googleMaps={googleMaps}
                            autocompletionRequest={{
                                input: search,
                                // Optional options
                                // https://developers.google.com/maps/documentation/javascript/reference?hl=fr#AutocompletionRequest
                            }}
                            // Optional props
                            onNoResult={this.handleNoResult}
                            onSelectSuggest={this.handleSelectSuggest}
                            onStatusUpdate={this.handleStatusUpdate}
                            textNoResults="no results" // null or "" if you want to disable the no results item
                            customRender={prediction => (
                                <div className="customWrapper">
                                    {prediction
                                        ? prediction.description
                                        : "no results"}
                                </div>
                            )}
                        >
                            <input
                                type="text"
                                value={value}
                                placeholder="enter location"
                                onChange={this.handleInputChange}
                                className="text-input"
                            />
                        </ReactGooglePlacesSuggest>
                    )
                }
            />
        )
    }
}

class NearbySearch extends React.Component {
    state = {
        value: "",
        lat: 0,
        lng: 0,
        nearbyResult: [],
        pagination: null,
        getGroup: false,
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.nearbyResult !== this.state.nearbyResult && typeof this.props.updateNearbyResult === 'function') {
            this.props.updateNearbyResult(this.state.lat, this.state.lng, this.state.nearbyResult, this.state.pagination);
        }
    }

    fetchNearby = (value, lat, lng) => {
        const service = new window.google.maps.places.PlacesService(document.createElement('div'));
        const google = window.google;
        let placesRequest = this.props.placesRequest;
        placesRequest.location = new window.google.maps.LatLng(lat, lng);
        console.log(placesRequest);

        service.nearbySearch(placesRequest, ((response, status, pagination) => {
            console.log(pagination);

            // remove all results that does not have a photo
            response.forEach((element, index) => {
                if (!element.photos) {
                    response.splice(index, 1);
                }
            });

            if (status === google.maps.places.PlacesServiceStatus.OK) {
                this.setState({
                    value: value,
                    lat: lat,
                    lng: lng,
                    nearbyResult: response,
                    pagination: pagination.hasNextPage ? pagination : null,
                });
            } else {
                console.log("GOOGLE_MAP_API ERROR: " + status);
            }
        }));
    }

    toggleGetGroup = () => {
        this.setState({
            getGroup: this.state.getGroup ? false : true
        });
    }

    render() {
        return (
            <Row id="NearbySearch" className={this.props.uuid != null ? "d-none" : ""}>
                {this.state.getGroup ? (
                    <Col>
                        <JoinGroup toggleGetGroup={this.toggleGetGroup} fetchNearby={this.fetchNearby} />
                    </Col>
                ) : (
                        <Col>
                            <Row>
                                <Col md={12}>
                                    <h1>
                                        <FontAwesomeIcon icon={faMapMarkedAlt} />
                                    </h1>
                                </Col>
                                <Col md={12}>
                                    <GoogleSuggest fetchNearby={this.fetchNearby} />
                                </Col>
                                <Col md={12}>
                                    <CurrentLocation fetchNearby={this.fetchNearby} />
                                </Col>
                                <Col md={12}>
                                    <Button variant="primary" onClick={this.toggleGetGroup}>
                                        join group
                                <FontAwesomeIcon icon={faUsers} />
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    )
                }
            </Row>
        )
    }
}

export default NearbySearch;