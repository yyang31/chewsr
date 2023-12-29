import React from "react";
import "./card.scss";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-regular-svg-icons";

class Card extends React.Component {
    render() {
        console.log(this.props.place.name);
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
                <Col
                    className="show-detail-button button blue"
                    onClick={() => this.props.toggleShowDetail()}
                >
                    detail
                </Col>
                {(() => {
                    if (this.props.showDetail) {
                        return (
                            <Col className="place-detail">
                                <Row className="place-name no-gutters">
                                    {this.props.place.name}
                                </Row>
                                <Row className="place-price no-gutters">
                                    {[
                                        ...Array(this.props.place.price_level),
                                    ].map((elementInArray, index) => (
                                        <FontAwesomeIcon icon={faDollarSign} />
                                    ))}
                                </Row>
                                <Row className="place-review no-gutters">
                                    <div className="place-rating">
                                        {this.props.place.rating}
                                        <FontAwesomeIcon icon={faStar} />
                                    </div>
                                    <div className="place-rating-count">
                                        {this.props.place.user_ratings_total}{" "}
                                        reviews
                                    </div>
                                </Row>
                            </Col>
                        );
                    }
                })()}
            </Row>
        );
    }
}

export default Card;
