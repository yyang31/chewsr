import React from "react";
import ReactDOM from "react-dom";
import "./card.scss";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-regular-svg-icons";

class Card extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            placeNameOverflowed: undefined,
        };
    }

    componentDidMount() {
        var placeNameDom =
            ReactDOM.findDOMNode(this).getElementsByClassName("place-name")[0];

        this.setState({
            placeNameOverflowed:
                placeNameDom.offsetWidth < placeNameDom.scrollWidth,
        });
    }

    componentDidUpdate() {
        if (this.props.isTop && this.state.placeNameOverflowed) {
            console.log("set");

            var placeNameDom =
                ReactDOM.findDOMNode(this).getElementsByClassName(
                    "place-name"
                )[0];

            document.documentElement.style.setProperty(
                "--place-name-scroll-width",
                placeNameDom.scrollWidth + "px"
            );
        }
    }

    render() {
        return (
            <Row className="card no-gutters">
                {(() => {
                    if (this.props.place.photos) {
                        return (
                            <Col className="place-photo">
                                {this.props.place.photos.map((photo, i) => {
                                    return (
                                        <img
                                            key={
                                                "photo-" +
                                                this.props.place.place_id
                                            }
                                            src={photo.getUrl()}
                                            alt={this.props.place.name}
                                        />
                                    );
                                })}
                            </Col>
                        );
                    }
                })()}
                <Col className="place-detail">
                    <Row className="no-gutters">
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
                            <Row className="place-price no-gutters">
                                {[...Array(this.props.place.price_level)].map(
                                    (elementInArray, index) => (
                                        <FontAwesomeIcon
                                            key={
                                                this.props.place.place_id +
                                                index
                                            }
                                            icon={faDollarSign}
                                        />
                                    )
                                )}
                            </Row>
                            <Row className="place-rating no-gutters">
                                {this.props.place.rating}
                                <FontAwesomeIcon icon={faStar} />
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }
}

export default Card;
