import React from "react";
import "./DeveloperInfo.css";

const DeveloperInfo = () => {
  return (<div className="developer-info-container">
    <h1>About</h1>
    <p>
      This website is developed by James Cao during App Academy's React Project Assignment.
    </p>
    <p>
      If you have interets of contacting him please use the following links.
    </p>
    <div>
      <ul>
        <li>
          <a href="https://github.com/jameslovescoding"><i className="fa-brands fa-github"></i> GitHub Profile</a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/james-cao-15a0b477/"><i className="fa-brands fa-linkedin"></i> LinkedIn Profile</a>
        </li>
      </ul>
    </div>
  </div>)
}

export default DeveloperInfo