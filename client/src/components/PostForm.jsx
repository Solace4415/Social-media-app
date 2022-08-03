import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { FETCH_POSTS_QUERY } from "../utils/graphql";

const PostForm = () => {
  const [error, setError] = useState("");
  const [values, setValues] = useState({
    body: "",
  });
  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const [createPost] = useMutation(CREATE_POST_MUTATION, {
    update(proxy, result) {
      let data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });

      data = { getPosts: [result?.data?.createPost, ...data.getPosts] };
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      values.body = "";
    },

    onError(err) {
      setError(err.message);
    },

    variables: values,
  });

  const onSubmit = (e) => {
    e.preventDefault();
    createPost();
  };
  return (
    <div>
      <Form onSubmit={onSubmit} noValidate>
        <h2>Create a post:</h2>
        <Form.Input
          placeholder="Hi World"
          name="body"
          type="text"
          onChange={onChange}
          value={values.body}
          error={error ? true : false}
        />
        <Button type="submit" color="teal">
          Submit
        </Button>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      username
      body
      createdAt
      likeCount
      likes {
        username
        id
        createdAt
      }
      commentCount
      comments {
        id
        username
        body
        createdAt
      }
    }
  }
`;

export default PostForm;
