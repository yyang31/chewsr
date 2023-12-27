import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class SwipeBoard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            nearbyResult: null,
            pagination: null,
        };
    }

    componentDidUpdate() {
        if (!this.state.nearbyResult) {
            this.fetchNearby();
        }
        console.log("here");
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
                } else {
                    this.props.setToastMessage(
                        "error",
                        "GOOGLE_MAP_API ERROR: " + status
                    );
                }
            }
        );
    };

    render() {
        return <Row id="swipeBoard" className="no-gutters"></Row>;
    }
}

export default SwipeBoard;
