import React from "react";
import "./home.scss";

// bootstrap
import { Dropdown, DropdownButton, Button } from "react-bootstrap";

// google map/places api
import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGooglePlacesSuggest from "react-google-places-suggest";

// font awsome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUtensils,
    faPen,
    faLocationArrow,
} from "@fortawesome/free-solid-svg-icons";

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
        this.props.fetchNearby(
            geocodedPrediction.formatted_address,
            geocodedPrediction.geometry.location.lat(),
            geocodedPrediction.geometry.location.lng()
        );

        this.setState({
            search: "",
            value: geocodedPrediction.formatted_address,
        });
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

    getLatLng = () => {
        return;
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

class NewSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            restaurantType: "all",
            searchCurrentLocation: true,
            placesRequest: {
                location: null,
                type: ["restaurant"],
                radius: 16093.4, // 16093.4 meters ~ 10 miles
                keyword: "",
                minprice: 0,
                maxprice: 4, // price range from 0 ~ 4, with 0 been most affordable and 4 been most expensive
                openNow: true,
            },
        };

        this.restaurantTypes = [
            "all",
            "fast food",
            "chinese",
            "italian",
            "mexican",
            "vegetarian",
        ];
    }

    componentDidMount() {
        this.getCurrentLocation();
    }

    getCurrentLocation = () => {
        if (navigator.geolocation) {
            // this.props.toggleLoadingOverlay(true);
            navigator.geolocation.getCurrentPosition(
                this.showPosition,
                this.accessDenied
            );
        } else {
            // this.props.toggleLoadingOverlay(false);
            this.props.setToastMessage(
                "error",
                "geolocation is not supported by this browser"
            );
        }
    };

    showPosition = (position) => {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        // this.fetchNearby("", lat, lng);
    };

    accessDenied = () => {
        // this.props.toggleLoadingOverlay(false);
        this.props.setToastMessage("error", "access to location denied");
    };

    // fetchNearby = (
    //     value,
    //     lat,
    //     lng,
    // ) => {
    //     // this.props.toggleLoadingOverlay(true);

    //     const service = new window.google.maps.places.PlacesService(
    //         document.createElement("div")
    //     );
    //     const google = window.google;
    //     let placesRequest : google.maps.places.PlaceSearchRequest = {
    //         location = new window.google.maps.LatLng(lat, lng)
    //     }

    //     service.nearbySearch(placesRequest, (response, status, pagination) => {
    //         response.forEach((element, index) => {
    //             // deleting open_now, becuase it is deprecated as of November 2019
    //             if (element.opening_hours) {
    //                 delete element.opening_hours.open_now;
    //             }

    //             // remove all results that does not have a photo
    //             if (!element.photos) {
    //                 response.splice(index, 1);
    //             }
    //         });

    //         if (status === google.maps.places.PlacesServiceStatus.OK) {
    //             this.setState({
    //                 value: value,
    //                 lat: lat,
    //                 lng: lng,
    //                 nearbyResult: response,
    //                 pagination: pagination.hasNextPage ? pagination : null,
    //                 groupID: groupID,
    //                 getGroup: false,
    //                 placesRequest: placesRequest,
    //             });
    //         } else {
    //             this.props.setToastMessage(
    //                 "error",
    //                 "GOOGLE_MAP_API ERROR: " + status
    //             );
    //         }
    //     });
    // };

    selectRestaurantType = (selection) => {
        this.setState({
            restaurantType: selection,
        });
    };

    render() {
        return (
            <span>
                <div id="newSearch">
                    <div id="locationSearchContainer">
                        {(() => {
                            if (this.state.searchCurrentLocation) {
                                return (
                                    <span>
                                        <div>
                                            {" "}
                                            <FontAwesomeIcon
                                                icon={faLocationArrow}
                                            />
                                            current location
                                        </div>
                                        <Button variant="primary">
                                            <FontAwesomeIcon icon={faPen} />
                                        </Button>
                                    </span>
                                );
                            } else {
                                return (
                                    <GoogleSuggest
                                        fetchNearby={this.fetchNearby}
                                        setToastMessage={
                                            this.props.setToastMessage
                                        }
                                    />
                                );
                            }
                        })()}
                    </div>
                    <DropdownButton
                        id="restaurantTypeButton"
                        title={this.state.restaurantType}
                    >
                        {this.restaurantTypes.map((type, i) => {
                            return (
                                <Dropdown.Item
                                    key={i}
                                    onClick={() =>
                                        this.selectRestaurantType(type)
                                    }
                                >
                                    {type}
                                </Dropdown.Item>
                            );
                        })}
                    </DropdownButton>
                </div>
                <div className="menu-options">
                    <div onClick={() => this.props.selectMenuOption("")}>
                        back<span>home</span>
                    </div>
                </div>
            </span>
        );
    }
}

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedMenuOption: "",
        };
    }

    selectMenuOption = (selection) => {
        this.setState({
            selectedMenuOption: selection,
        });
    };

    render() {
        return (
            <div id="home">
                <h1>
                    chews<span>r</span>
                </h1>
                {(() => {
                    if (this.state.selectedMenuOption === "new") {
                        return (
                            <NewSearch
                                selectMenuOption={this.selectMenuOption}
                            ></NewSearch>
                        );
                    } else if (this.state.selectedMenuOption === "join") {
                        return <div>join</div>;
                    } else if (this.state.selectedMenuOption === "help") {
                        return <div>help</div>;
                    } else {
                        return (
                            <div className="menu-options">
                                <div
                                    onClick={() => this.selectMenuOption("new")}
                                >
                                    new<span>search</span>
                                </div>
                                <div
                                    onClick={() =>
                                        this.selectMenuOption("join")
                                    }
                                >
                                    join<span>group</span>
                                </div>
                                <div
                                    onClick={() =>
                                        this.selectMenuOption("help")
                                    }
                                >
                                    help<span>learn</span>
                                </div>
                            </div>
                        );
                    }
                })()}
                <span className="background-icons">
                    <FontAwesomeIcon icon={faUtensils} />
                </span>
            </div>
        );
    }
}

export default Home;
