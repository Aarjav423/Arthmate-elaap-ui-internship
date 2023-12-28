import React, { Component } from "react";
import loader from "../../assets/img/loader.png";

class Preloader extends Component {
  render() {
    return (
      <>
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "#F8F8F8AD"
          }}
        >
          <div
            style={{
              left: "45%",
              top: "30%",
              zIndex: "1000",
              position: "absolute"
            }}
          >
            <img src={loader} />
          </div>
        </div>
      </>
    );
  }
}

export default Preloader;
