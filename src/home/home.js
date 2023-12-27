import React from "react";
import "./home.scss";

// bootstrap
import { Dropdown, DropdownButton, Button } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// google map/places api
import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGooglePlacesSuggest from "react-google-places-suggest";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faLocationArrow } from "@fortawesome/free-solid-svg-icons";

const GOOGLE_API_KEY = "AIzaSyCFDZdtTK1ZsatLNERYCI2U_yoXcZIXeDk";

class GoogleSuggest extends React.Component {
    state = {
        search: "",
        value: "",
        status: "",
    };

    componentDidUpdate(prevProps, prevState) {
        // status change
        if (
            prevState.status !== this.state.status &&
            this.state.status !== "" &&
            document.getElementsByClassName("sc-EHOje").length > 0
        ) {
            if (
                this.state.status ===
                window.google.maps.places.PlacesServiceStatus.OK
            ) {
                document
                    .getElementsByClassName("sc-EHOje")[0]
                    .classList.remove("invalid");
            } else {
                document
                    .getElementsByClassName("sc-EHOje")[0]
                    .classList.add("invalid");
            }
        }
    }

    handleInputChange = (e) => {
        this.setState({
            search: e.target.value,
            value: e.target.value,
        });
    };

    handleSelectSuggest = (geocodedPrediction, originalPrediction) => {
        this.setState({
            value: geocodedPrediction.formatted_address,
        });
        this.props.toggleLoadingOverlay(true);
        this.props.setPlacesRequestLocation(
            geocodedPrediction.geometry.location.lat(),
            geocodedPrediction.geometry.location.lng()
        );
    };

    handleNoResult = () => {
        this.props.setToastMessage(
            "error",
            "No results for " + this.state.search
        );
    };

    handleStatusUpdate = (status) => {
        if (status !== this.state.status) {
            this.setState({
                status: status,
            });
        }
    };

    render() {
        const { search, value } = this.state;
        return (
            <ReactGoogleMapLoader
                params={{
                    key: GOOGLE_API_KEY,
                    libraries: "places,geocoded",
                }}
                render={(googleMaps) =>
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
                            customRender={(prediction) => (
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
                                placeholder="location"
                                onChange={this.handleInputChange}
                                className="text-input"
                            />
                        </ReactGooglePlacesSuggest>
                    )
                }
            />
        );
    }
}

class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    getCurrentLocation = () => {
        this.props.toggleLoadingOverlay(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                this.setLocation,
                this.accessDenied
            );
        } else {
            this.props.setToastMessage(
                "error",
                "geolocation is not supported by this browser"
            );
            this.props.toggleLoadingOverlay(false);
        }
    };

    setLocation = (position) => {
        console.log(position);
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        this.setPlacesRequestLocation(lat, lng);
    };

    accessDenied = () => {
        this.props.setToastMessage("error", "access to location denied");
        this.props.toggleLoadingOverlay(false);
    };

    setPlacesRequestLocation = (lat, lng) => {
        this.props.placesRequest.lat = lat;
        this.props.placesRequest.lng = lng;
        this.props.setPlacesRequest(this.props.placesRequest);
        this.props.toggleLoadingOverlay(false);
    };

    render() {
        return (
            <Row id="home" className="no-gutters">
                <Col id="landing">
                    <Row id="homeTop" className="no-gutters">
                        <div id="siteName">chewsr</div>
                    </Row>
                    <Row id="homeButton" className="no-gutters">
                        <Col className="p-3">
                            <Row className="input-wrapper">
                                <GoogleSuggest
                                    toggleLoadingOverlay={
                                        this.props.toggleLoadingOverlay
                                    }
                                    setToastMessage={this.props.setToastMessage}
                                    setPlacesRequestLocation={
                                        this.setPlacesRequestLocation
                                    }
                                />
                                <div
                                    id="currentLocationButton"
                                    onClick={() => this.getCurrentLocation()}
                                >
                                    <FontAwesomeIcon icon={faLocationArrow} />
                                </div>
                            </Row>
                            <hr />
                            <Row
                                className="button blue"
                                onClick={() => this.selectMenuOption("join")}
                            >
                                join with code
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }
}

export default Home;
