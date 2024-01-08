import React from "react";
import "./board.scss";

import Card from "../card/card";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faSlidersH } from "@fortawesome/free-solid-svg-icons";

const numLoad = 5; // number of photos or cards loads at a time

class Board extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            nearbyResult: null,
            pagination: null,
        };
    }

    componentDidMount() {
        if (!this.state.nearbyResult) {
            this.fetchNearby();
        }
        console.log(this.state.nearbyResult);
    }

    fetchNearby = () => {
        this.props.toggleLoadingOverlay(true);

        const service = new window.google.maps.places.PlacesService(
            document.createElement("div")
        );
        const google = window.google;

        service.nearbySearch(
            this.props.placesRequest,
            (response, status, pagination) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    this.setState({
                        nearbyResult: response,
                        pagination: pagination.hasNextPage ? pagination : null,
                    });
                    this.props.toggleLoadingOverlay(false);
                } else {
                    this.props.setToastMessage(
                        "error",
                        "GOOGLE_MAP_API ERROR: " + status
                    );
                }
            }
        );
    };

    selectionMade = (like) => {
        let nearbyResult = this.state.nearbyResult;

        if (like) {
            console.log("like");
        } else {
            console.log("dislike");
        }

        nearbyResult.shift();

        this.setState({
            nearbyResult: nearbyResult,
        });
    };

    render() {
        let renderedNearbyResult = [];
        let nearbyResult = this.state.nearbyResult;
        if (nearbyResult && nearbyResult.length > 0) {
            for (var i = 0; i < nearbyResult.length; i++) {
                renderedNearbyResult.push(nearbyResult[i]);
            }
        }

        return (
            <Row id="board" className="no-gutters">
                {(() => {
                    if (this.state.nearbyResult) {
                        return (
                            <Col>
                                <Row id="menuBar" className="no-gutters">
                                    <Col id="logo">chewsr</Col>
                                    <Col id="settingButton">
                                        <FontAwesomeIcon icon={faSlidersH} />
                                    </Col>
                                </Row>
                                <Row id="cardContainer" className="no-gutters">
                                    {(() => {
                                        if (renderedNearbyResult.length > 0) {
                                            return (
                                                <Col className="card-placeholder">
                                                    {renderedNearbyResult
                                                        .reverse()
                                                        .map((place, index) => {
                                                            return (
                                                                <Card
                                                                    place={
                                                                        place
                                                                    }
                                                                    key={
                                                                        place.place_id
                                                                    }
                                                                    index={
                                                                        index
                                                                    }
                                                                    isTop={
                                                                        index ==
                                                                        renderedNearbyResult.length -
                                                                            1
                                                                            ? true
                                                                            : false
                                                                    }
                                                                />
                                                            );
                                                        })}
                                                </Col>
                                            );
                                        } else {
                                            return (
                                                <Col className="card-placeholder">
                                                    loading places
                                                </Col>
                                            );
                                        }
                                    })()}
                                </Row>
                                <Row id="controlBar" className="no-gutters">
                                    <div
                                        className="button"
                                        onClick={() =>
                                            this.selectionMade(false)
                                        }
                                    >
                                        <FontAwesomeIcon icon={faThumbsDown} />
                                    </div>
                                    <div
                                        className="button"
                                        onClick={() => this.selectionMade(true)}
                                    >
                                        <FontAwesomeIcon icon={faThumbsUp} />
                                    </div>
                                </Row>
                            </Col>
                        );
                    } else {
                        return <div></div>;
                    }
                })()}
            </Row>
        );
    }
}

export default Board;
