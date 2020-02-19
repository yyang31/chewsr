import React, { Component } from "react"
import './google_map_api.scss'

import ReactGoogleMapLoader from "react-google-maps-loader"
import ReactGooglePlacesSuggest from "react-google-places-suggest"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons'

const GOOGLE_API_KEY = "AIzaSyCFDZdtTK1ZsatLNERYCI2U_yoXcZIXeDk"

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
            <button id="currentLocation" className="btn" onClick={this.getLocation}>
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
        pagination: null
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.nearbyResult !== this.state.nearbyResult && typeof this.props.updateNearbyResult === 'function') {
            this.props.updateNearbyResult(this.state.nearbyResult, this.state.pagination);
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
                // pagination.nextPage();
            } else {
                console.log("GOOGLE_MAP_API ERROR: " + status);
            }
        }));
    }

    render() {
        return (
            <div id="NearbySearch" className={this.state.nearbyResult.length > 0 ? "d-none" : ""}>
                <GoogleSuggest fetchNearby={this.fetchNearby} />
                <CurrentLocation fetchNearby={this.fetchNearby} />
            </div>
        )
    }
}

export default NearbySearch;