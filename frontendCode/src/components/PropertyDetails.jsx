import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PropertyDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedLocation = location.state;
  console.log("SELECT", selectedLocation);

  function parseDateString(dateStr) {
    if (!dateStr) return null;
    const nums = dateStr.match(/\d+/g);
    if (!nums || nums.length < 3) return null;

    let y, m, d;
    if (nums[0].length === 4) {
      y = parseInt(nums[0], 10);
      m = parseInt(nums[1], 10);
      d = parseInt(nums[2], 10);
    } else {
      d = parseInt(nums[0], 10);
      m = parseInt(nums[1], 10);
      y = parseInt(nums[2], 10);
    }
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  }

  function parseTimeString(timeStr) {
    if (!timeStr) return { hours: 0, minutes: 0, ok: false };
    const m = timeStr.trim().match(/^\s*(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM|am|pm)?\s*$/);
    if (!m) return { hours: 0, minutes: 0, ok: false };

    let hours = parseInt(m[1], 10);
    const minutes = parseInt(m[2], 10);
    const ampm = m[3]?.toLowerCase();

    if (ampm) {
      if (ampm === "pm" && hours < 12) hours += 12;
      if (ampm === "am" && hours === 12) hours = 0;
    }
    return { hours, minutes, ok: true };
  }

  function combineDateTime(dateStr, timeStr) {
    const d = parseDateString(dateStr);
    if (!d) return null;
    const { hours, minutes, ok } = parseTimeString(timeStr || "00:00");
    if (!ok && timeStr) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), hours, minutes, 0, 0);
  }

  const isBookingOpen = (property) => {
    if (!property?.availableFrom) return false;

    const now = new Date();

    // ❌ If no seats -> closed
    if (property?.seatAvailable === false) return false;

    const showDateOnly = parseDateString(property.availableFrom);
    if (!showDateOnly || isNaN(showDateOnly.getTime())) return false;

    const todayDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const showDateOnlyKey = new Date(showDateOnly.getFullYear(), showDateOnly.getMonth(), showDateOnly.getDate());

    if (showDateOnlyKey < todayDateOnly) return false;
    if (showDateOnlyKey > todayDateOnly) return true;

    // Same day -> check time if exists
    if (!property?.startTime) return false;

    const showDateTime = combineDateTime(property.availableFrom, property.startTime);
    if (!showDateTime || isNaN(showDateTime.getTime())) return false;

    const cutoff = new Date(showDateTime.getTime() - 60 * 60 * 1000);
    return now < cutoff;
  };

  if (!selectedLocation || !selectedLocation.properties) {
    return (
      <div className="container py-5 text-center">
        <h2>Properties Not Found</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-center">
        Properties in {selectedLocation.name}
      </h2>
      <p className="text-center text-muted mb-5">{selectedLocation.description}</p>

      <div className="row">
        {selectedLocation.properties.map((property, index) => {
          const bookingEnabled = isBookingOpen(property);

          return (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <div className="card bg-dark shadow-sm h-100 text-white">
                <img
                  src={property.image1}
                  alt={property.title}
                  className="card-img-top p-4"
                />
                <div className="card-body">
                  <h5 className="card-title">{property.title}</h5>
                  <p className="card-text"><strong>{property.shortDescription}</strong> </p>
                  <p className="card-text"><strong>Address:</strong> {property.address}</p>
                  <p className="card-text"><strong>Price:</strong> {property.price}</p>
                  <p className="card-text"><strong>Date:</strong> {property.availableFrom}</p>
                  <p className="mb-1"><strong>Details:</strong></p>
                  <ul className="mb-2">
                    {property.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>

                  <button
                    className="bannerBtn mt-2 w-100"
                    disabled={!bookingEnabled}
                    onClick={() => navigate("/viewMore", { state: { product: property } })}
                  >
                    {bookingEnabled ? "Book Now" : "Booking Closed"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          ← Back to Locations
        </button>
      </div>
    </div>
  );
};

export default PropertyDetails;
