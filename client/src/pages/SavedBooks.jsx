import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ME } from "../utils/queries"; // Import your queries/mutations
import { REMOVE_BOOK } from "../utils/mutations";

import { Container, Card, Button, Row, Col } from "react-bootstrap";
import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);

  const [removeBookMutation] = useMutation(REMOVE_BOOK);

  // Use optional chaining to avoid errors if data is not available
  const userData = data?.me || {};
  const savedBooks = userData.savedBooks || []; // Handle the case when savedBooks is undefined

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeBookMutation({
        variables: { bookId: bookId },
      });

      // Update the local state with the updated user data
      // Assuming setUserData is a function to update user data, make sure it's defined
      if (setUserData) {
        setUserData(data.removeBook);
      }

      // Upon success, remove the book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // If data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      {/* ... (rest of the component) */}
      <h2 className="pt-5">
        {savedBooks.length
          ? `Viewing ${savedBooks.length} saved ${
              savedBooks.length === 1 ? "book" : "books"
            }:`
          : "You have no saved books!"}
      </h2>
      <Row>
        {savedBooks.map((book) => {
          return (
            <Col md="4" key={book.bookId}>
              {/* ... (rest of the card rendering) */}
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default SavedBooks;
