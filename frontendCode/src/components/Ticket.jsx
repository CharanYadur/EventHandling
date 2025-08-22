import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const Ticket = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const ticket = state?.ticket;
  const showDetails = state?.showDetails; // ✅ Use this for place, hall, date, etc.

  if (!ticket || !showDetails) {
    return (
      <div className="container text-center py-5">
        <h3 className="text-danger">No ticket data found!</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          Go Back
        </button>
      </div>
    );
  }


  const generatePDF = () => {
    const doc = new jsPDF();

    // Draw border
    doc.setLineWidth(1.5);
    doc.rect(10, 10, 190, 280); // x, y, width, height

    // Title
    doc.setFontSize(22);
    doc.setTextColor(237, 151, 76); // orange
    doc.setFont("helvetica", "bold");
    doc.text("Event Ticket", 105, 25, { align: "center" });

    // Draw a line below title
    doc.setLineWidth(0.5);
    doc.setDrawColor(237, 151, 76);
    doc.line(10, 30, 200, 30);

    // Ticket Details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    let y = 40;
    doc.text(`Booking ID: ${ticket._id}`, 20, y);
    y += 10;
    doc.text(`Show: ${showDetails.name}`, 20, y);
    y += 10;
    doc.text(`Place: ${showDetails.place}`, 20, y);
    y += 10;
    doc.text(`Hall: ${showDetails.hall}`, 20, y);
    y += 10;
    doc.text(`Date: ${showDetails.date}`, 20, y);
    y += 10;
    doc.text(`Time: ${showDetails.time}`, 20, y);
    y += 10;
    doc.text(`Total Paid: ${ticket.totalAmount}`, 20, y);

    // Ticket Holders
    y += 15;
    doc.setFont("helvetica", "bold");
    doc.text("Ticket Holders:", 20, y);
    y += 10;
    doc.setFont("helvetica", "normal");
    ticket.ticketHolders?.forEach((holder, idx) => {
      doc.text(`${idx + 1}. ${holder} - Seat ${ticket.selectedSeats[idx]}`, 30, y);
      y += 10;
    });


    // Contact
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Contact Info:", 20, y);
    y += 10;
    doc.setFont("helvetica", "normal");
    doc.text(`Email: ${ticket.email}`, 20, y);
    y += 10;
    doc.text(`Mobile: ${ticket.mobile}`, 20, y);

    // Footer line
    doc.setDrawColor(237, 151, 76);
    doc.setLineWidth(0.5);
    doc.line(10, 275, 200, 275);

    // Save PDF
    doc.save(`Ticket_${ticket._id}.pdf`);
  };

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div
        className="card shadow-lg p-4"
        style={{
          borderRadius: "20px",
          maxWidth: "600px",
          width: "100%",
          background: "linear-gradient(135deg, #fff 70%, #fef4ea)",
        }}
      >
        {/* Header */}
        <div className="text-center border-bottom pb-3">
          <h2 style={{ color: "#ed974c" }}>🎟️ Your Ticket</h2>
          <p className="text-muted mb-0">Show ID: {ticket.showId}</p>
          <p className="fw-bold mt-1">Booking ID: {ticket._id}</p>
        </div>

        {/* Show Details */}
        <div className="mt-4">
          <h4 className="fw-bold">{showDetails.name}</h4>
          <p><strong>📍 Place:</strong> {showDetails.place}</p>
          <p><strong>🏛 Hall:</strong> {showDetails.hall}</p>
          <p><strong>📅 Date:</strong> {showDetails.date}</p>
          <p><strong>⏰ Time:</strong> {showDetails.time}</p>
          <p><strong>💰 Total Paid:</strong> ₹{ticket.totalAmount}</p>
        </div>

        {/* Ticket Holders */}
       // Ticket Holders section in Ticket.jsx
        <div className="mt-4">
          <h5>👥 Ticket Holders & Seats</h5>
          <ul className="list-group list-group-flush">
            {ticket.ticketHolders?.map((holder, idx) => (
              <li key={idx} className="list-group-item">
                {idx + 1}. {holder} - Seat {ticket.selectedSeats?.[idx] ?? "N/A"}
              </li>
            ))}

          </ul>
        </div>


        {/* Contact Info */}
        <div className="mt-4">
          <p><strong>📧 Email:</strong> {ticket.email}</p>
          <p><strong>📱 Mobile:</strong> {ticket.mobile}</p>
        </div>

        {/* PDF Download */}
        <div className="text-center mt-4">
          <button className="btn btn-success px-4" onClick={generatePDF}>
            📥 Download Ticket (PDF)
          </button>
        </div>

        {/* Back Button */}
        <div className="d-flex justify-content-center mt-3">
          <button className="btn btn-outline-primary px-4" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ticket;

