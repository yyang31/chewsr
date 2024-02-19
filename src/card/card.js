import React from "react";
import ReactDOM from "react-dom";
import "./card.scss";

import { Container, Row, Col } from "react-bootstrap";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-regular-svg-icons";

class Card extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            placeNameOverflowed: undefined,
            placeDetail: undefined,
            curPhotoIndex: -1,
            loaded: false,
        };
    }

    componentDidMount() {
        // get placeDetails
        const service = new window.google.maps.places.PlacesService(
            document.createElement("div")
        );
        service.getDetails(
            { placeId: this.props.place.place_id },
            (response) => {
                this.setState({
                    placeDetail: response,
                });
            }
        );

        // update place name offset
        var placeNameDom =
            ReactDOM.findDOMNode(this).getElementsByClassName("place-name")[0];

        this.setState({
            placeNameOverflowed:
                placeNameDom.offsetWidth < placeNameDom.scrollWidth,
        });
    }

    componentDidUpdate() {
        if (
            !this.state.loaded &&
            this.state.placeDetail &&
            this.props.isTop &&
            this.state.placeNameOverflowed
        ) {
            var placeNameDom =
                ReactDOM.findDOMNode(this).getElementsByClassName(
                    "place-name"
                )[0];

            document.documentElement.style.setProperty(
                "--place-name-scroll-width",
                placeNameDom.scrollWidth + "px"
            );

            // set interval for photo switching
            this.nextPhoto();

            this.setState({
                loaded: true,
            });
        }
    }

    nextPhoto(index = undefined) {
        var newIndex = 0;
        if (index != undefined) {
            const interval_id = window.setInterval(function () {},
            Number.MAX_SAFE_INTEGER);

            // Clear any timeout/interval up to that id
            for (let i = 1; i < interval_id; i++) {
                window.clearInterval(i);
            }

            newIndex = index;
        } else {
            newIndex =
                this.state.curPhotoIndex + 1 ===
                this.state.placeDetail.photos.length
                    ? 0
                    : this.state.curPhotoIndex + 1;
        }

        setInterval(() => {
            this.nextPhoto();
        }, 5000);

        this.setState({
            curPhotoIndex: newIndex,
        });
    }

    render() {
        return (
            <Container fluid className="card">
                <Row>
                    {(() => {
                        if (this.state.loaded) {
                            return (
                                <Col className="place-photo">
                                    {this.state.placeDetail.photos.map(
                                        (photo, i) => {
                                            return (
                                                <img
                                                    key={
                                                        "photo-" +
                                                        i +
                                                        this.props.place
                                                            .place_id
                                                    }
                                                    src={photo.getUrl()}
                                                    alt={this.props.place.name}
                                                    className={
                                                        this.state
                                                            .curPhotoIndex === i
                                                            ? "cur-photo"
                                                            : ""
                                                    }
                                                />
                                            );
                                        }
                                    )}
                                </Col>
                            );
                        }
                    })()}
                    <Col className="bottom-cont">
                        {(() => {
                            if (this.state.loaded) {
                                return (
                                    <Row className="photo-bubble-cont">
                                        {Array.from(
                                            Array(
                                                this.state.placeDetail.photos
                                                    .length
                                            ),
                                            (e, i) => {
                                                return (
                                                    <span
                                                        key={i}
                                                        className={
                                                            this.state
                                                                .curPhotoIndex ===
                                                            i
                                                                ? "photo-bubble cur-photo-bubble"
                                                                : "photo-bubble"
                                                        }
                                                        onClick={() =>
                                                            this.nextPhoto(i)
                                                        }
                                                    />
                                                );
                                            }
                                        )}
                                    </Row>
                                );
                            }
                        })()}
                        <Row>
                            <Col className="place-detail">
                                <Row>
                                    <Col className="place-detail-right-container">
                                        <div
                                            className={
                                                "place-name" +
                                                (this.props.isTop &&
                                                this.state.placeNameOverflowed
                                                    ? " horizontal-scroll"
                                                    : "")
                                            }
                                        >
                                            {this.props.place.name}
                                        </div>
                                    </Col>
                                    <Col className="place-detail-left-container">
                                        <Row className="place-price">
                                            <Col>
                                                {[
                                                    ...Array(
                                                        this.props.place
                                                            .price_level
                                                    ),
                                                ].map(
                                                    (elementInArray, index) => (
                                                        <FontAwesomeIcon
                                                            key={
                                                                this.props.place
                                                                    .place_id +
                                                                index
                                                            }
                                                            icon={faDollarSign}
                                                        />
                                                    )
                                                )}
                                            </Col>
                                        </Row>
                                        <Row className="place-rating">
                                            <Col>{this.props.place.rating}</Col>
                                            <Col>
                                                <FontAwesomeIcon
                                                    icon={faStar}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Card;
