import React from 'react';

const AboutUs = () => {
  return (
    <div className="container bg-dark text-white p-4 rounded-4 my-5">
      <h2 className="text-center mb-4">About EventBright</h2>

      <p className="lead text-center mb-5">
        Discover, book, and enjoy amazing events — all in one place.
      </p>

      <div className="row mb-4">
        <div className="col-md-6">
          <h4>Who We Are</h4>
          <p>
            EventBright is your go-to platform for exploring and booking a variety of shows,
            from drama and dance performances to live concerts, comedy shows, and more.
            We connect audiences with unforgettable experiences while supporting event organizers.
          </p>
        </div>
        <div className="col-md-6">
          <h4>What We Offer</h4>
          <ul>
            <li>Wide range of events including music, theatre, dance, comedy, and cultural shows</li>
            <li>Easy search and filter options to find events that match your interests</li>
            <li>Seamless ticket booking with instant confirmations</li>
            <li>Secure and reliable platform trusted by event organizers and audiences</li>
            <li>User-friendly interface for browsing, booking, and managing tickets</li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-5">
        <h4>Our Mission</h4>
        <p>
          To make entertainment accessible and hassle-free — by helping people discover
          events they love and making it simple to attend them.
        </p>
      </div>

      <div className="text-center mt-5">
        <h4>Contact Us</h4>
        <p>
          Have questions or feedback? Reach out to us anytime at{" "}
          <a href="mailto:support@eventbright.com" className="text-info">support@charankumar.com</a>
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
