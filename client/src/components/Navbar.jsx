import React from "react";

const Navbar = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg" style={{ background: "white" }}>
        <div className="container d-flex align-items-center justify-content-between">
          <a className="navbar-brand fw-bold fs-4" href="#">
            AI Prompt
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
            <button className="btn btn-outline-success mx-1" type="button">
              Login
            </button>
            <button className="btn btn-outline-success mx-1" type="button">
              SignUp
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;


