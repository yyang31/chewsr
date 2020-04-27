import React from "react"
import './google_map_api.scss'

import Firebase from "firebase";
import firebaseConfig from "../config";

import ReactGoogleMapLoader from "react-google-maps-loader"
import ReactGooglePlacesSuggest from "react-google-places-suggest"

import Button from 'react-bootstrap/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow, faUsers, faMapMarkedAlt, faUndoAlt } from '@fortawesome/free-solid-svg-icons'
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
        };
    }

    getGroupNumber = (e) => {
        e.preventDefault(process.env.REACT_APP_FIREBASE_PRIVATE_KEY);

        let groupId = this.state.groupID;

        if (groupId !== '' && groupId.length === this.state.groupIDLength) {
            this.props.joinGroupByID(groupId);
        } else {
            this.props.setToastMessage("error", "group ID must be 5 digits");
        }
    }

    handleInputChange = (e) => {
        this.setState({
            groupID: e.target.value
        });
    }

    render() {
        return (
            <form onSubmit={this.getGroupNumber}>
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
            this.props.toggleLoadingOverlay(true);
            navigator.geolocation.getCurrentPosition(this.showPosition, this.accessDenied);
        } else {
            this.props.setToastMessage('error', 'geolocation is not supported by this browser');
        }
    }

    showPosition = (position) => {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        this.props.fetchNearby("", lat, lng);
    }

    accessDenied = () => {
        this.props.setToastMessage('error', 'access to location denied')
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
        if (prevState.status !== this.state.status && this.state.status !== "" && document.getElementsByClassName('sc-EHOje').length > 0) {
            if (this.state.status === window.google.maps.places.PlacesServiceStatus.OK) {
                document.getElementsByClassName('sc-EHOje')[0].classList.remove('invalid');
            } else {
                document.getElementsByClassName('sc-EHOje')[0].classList.add('invalid');
            }
        }
    }

    handleInputChange = e => {
        this.setState({
            search: e.target.value,
            value: e.target.value
        });
    }

    handleSelectSuggest = (geocodedPrediction, originalPrediction) => {
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
        this.props.setToastMessage('error', "No results for " + this.state.search);
    }

    handleStatusUpdate = status => {
        if (status !== this.state.status) {
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
        groupID: null
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.nearbyResult !== this.state.nearbyResult && typeof this.props.updateNearbyResult === 'function') {
            this.props.updateNearbyResult(
                this.state.lat,
                this.state.lng,
                this.state.nearbyResult,
                this.state.pagination,
                this.state.placesRequest,
                this.state.groupID
            );
        }
    }

    fetchNearby = (value, lat, lng, groupPlacesRequest = null, groupID = null) => {
        this.props.toggleLoadingOverlay(true);

        const service = new window.google.maps.places.PlacesService(document.createElement('div'));
        const google = window.google;
        let placesRequest = groupPlacesRequest ? groupPlacesRequest : this.props.placesRequest;
        placesRequest.location = new window.google.maps.LatLng(lat, lng);

        service.nearbySearch(placesRequest, ((response, status, pagination) => {
            response.forEach((element, index) => {
                // deleting open_now, becuase it is deprecated as of November 2019
                if (element.opening_hours) {
                    delete element.opening_hours.open_now;
                }

                // remove all results that does not have a photo
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
                    groupID: groupID,
                    getGroup: false,
                    placesRequest: placesRequest,
                });
            } else {
                this.props.setToastMessage('error', "GOOGLE_MAP_API ERROR: " + status);
            }
        }));
    }

    toggleGetGroup = () => {
        this.setState({
            getGroup: this.state.getGroup ? false : true
        });
    }

    joinGroupByID = (uuid) => {
        let ref = Firebase.database().ref("/" + uuid);

        ref.once("value", snapshot => {
            const val = snapshot.val();
            if (val == null) {
                this.props.setToastMessage("error", "the group ID does not exist");
            } else {
                this.props.toggleLoadingOverlay(true);
                this.fetchNearby("", val.lat, val.lng, val.placesRequest, uuid);
            }
        });
    }

    render() {
        return (
            <Row id="NearbySearch" className={this.props.uuid != null ? "d-none" : ""}>
                {this.state.getGroup ? (
                    <Col>
                        <JoinGroup
                            toggleGetGroup={this.toggleGetGroup}
                            joinGroupByID={this.joinGroupByID}
                            setToastMessage={this.props.setToastMessage}
                        />
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
                                    <GoogleSuggest
                                        fetchNearby={this.fetchNearby}
                                        setToastMessage={this.props.setToastMessage}
                                    />
                                </Col>
                                <Col md={12}>
                                    <CurrentLocation
                                        fetchNearby={this.fetchNearby}
                                        toggleLoadingOverlay={this.props.toggleLoadingOverlay}
                                        setToastMessage={this.props.setToastMessage}
                                    />
                                </Col>
                                <Col md={12}>
                                    <Button variant="primary" onClick={this.toggleGetGroup}>
                                        join group
                                        <FontAwesomeIcon icon={faUsers} />
                                    </Button>
                                </Col>
                                {this.props.cookies == null ? (
                                    null
                                ) : (
                                        <Col md={12}>
                                            <Button variant="primary" onClick={() => { this.joinGroupByID(this.props.cookies) }}>
                                                join previous session
                                                <FontAwesomeIcon icon={faUndoAlt} />
                                            </Button>
                                        </Col>
                                    )
                                }
                            </Row>
                        </Col>
                    )
                }
            </Row>
        )
    }
}

export default NearbySearch;