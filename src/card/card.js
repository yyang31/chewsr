import React from "react";
import "./card.scss";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
            </Row>
        );
    }
}

export default Card;
