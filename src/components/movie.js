import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import MovieDataService from "../services/movies";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Media from "react-bootstrap/Media";
import moment from "moment";

const Movie = ({ user }) => {
  console.log(user);
  const { id } = useParams();
  const [movie, setMovie] = useState({
    id: null,
    title: "",
    rated: "",
    reviews: [],
  });

  const getMovie = (id) => {
    console.log("Test");
    MovieDataService.get(id)
      .then((response) => {
        setMovie(response.data);
        console.log(`Response data : ${response.data}`);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getMovie(id);
  }, [id]);

  const deleteReview = (reviewId, index) => {
    MovieDataService.deleteReview(reviewId, id)
      .then((response) => {
        setMovie((prevState) => {
          prevState.reviews.splice(index, 1);
          return {
            ...prevState,
          };
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <Image src={movie.poster + "/100px250"} fluid />
          </Col>
          <Col>
            <Card>
              <Card.Header as="h5">{movie.title}</Card.Header>
              <Card.Body>
                <Card.Text>{movie.plot}</Card.Text>
                {user && (
                  <Link to={"/movies/" + id + "/review"}>Add Review</Link>
                )}
              </Card.Body>
            </Card>
            <br></br>
            <h2>Reviews</h2>
            <br></br>
            {movie.reviews.map((review, index) => {
              return (
                <Media key={index}>
                  <Media.Body>
                    <h5>
                      {review.name + " reviewd on "}{" "}
                      {moment(review.date).format("D MMMM YYYY")}
                    </h5>
                    <p>{review.review}</p>
                    {user && user.id === review.user_id && (
                      <Row>
                        <Col>
                          <Link
                            to={"/movies/" + id + "/review"}
                            state={{ currentReview: review }}
                          >
                            Edit
                          </Link>
                        </Col>
                        <Col>
                          <Button
                            variant="link"
                            onClick={() => deleteReview(review._id, index)}
                          >
                            Delete
                          </Button>
                        </Col>
                      </Row>
                    )}
                  </Media.Body>
                </Media>
              );
            })}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Movie;
