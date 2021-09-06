import React from "react";
import "./home.scss";

// bootstrap
import { Dropdown, DropdownButton } from "react-bootstrap";

// google map/places api
import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGooglePlacesSuggest from "react-google-places-suggest";

// font awsome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";

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

    selectRestaurantType = (selection) => {
        this.setState({
            restaurantType: selection,
        });
    };

    render() {
        return (
            <div id="newSearch">
                <GoogleSuggest
                    fetchNearby={this.fetchNearby}
                    setToastMessage={this.props.setToastMessage}
                />
                <DropdownButton
                    id="restaurant-type-button"
                    title={this.state.restaurantType}
                >
                    {this.restaurantTypes.map((type, i) => {
                        return (
                            <Dropdown.Item
                                key={i}
                                onClick={() => this.selectRestaurantType(type)}
                            >
                                {type}
                            </Dropdown.Item>
                        );
                    })}
                </DropdownButton>
            </div>
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
                        return <NewSearch></NewSearch>;
                    } else if (this.state.selectedMenuOption === "join") {
                        return <div>join</div>;
                    } else if (this.state.selectedMenuOption === "help") {
                        return <div>help</div>;
                    } else {
                        return (
                            <div id="menuOptions">
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
