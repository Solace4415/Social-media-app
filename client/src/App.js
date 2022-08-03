import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "semantic-ui-css/semantic.min.css";
import "./App.css";

import { AuthContext } from "../src/context/auth";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MenuBar from "./components/MenuBar";
import { Navigate } from "react-router-dom";
import { Container } from "semantic-ui-react";
import SinglePost from "./pages/SinglePost";

const App = () => {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Container>
        <MenuBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register />}
          />
          <Route path="/post/:postId" element={<SinglePost />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
