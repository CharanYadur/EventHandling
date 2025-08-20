import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../AxiousConfig";

const MoreDetails = () => {
  const { state } = useLocation();
  const product = state?.product;
  console.log("PRODUCT@", product)
  const navigate = useNavigate();
  const [tickets, setTickets] = useState(1);
  const [ticketHolders, setTicketHolders] = useState([""]);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [isBookEnabled, setIsBookEnabled] = useState(false);

  // Fallback to price if cost isn't present
  const unitCost = useMemo(() => {
    const n = Number(product?.cost ?? product?.price ?? 0);
    return Number.isFinite(n) ? n : 0;
  }, [product]);

  useEffect(() => {
    if (!product) return;
    setTicketHolders([""]);
    setTickets(1);
  }, [product]);

  // Keep ticketHolders array in sync with tickets count
  useEffect(() => {
    setTicketHolders((prev) => {
      if (tickets > prev.length) {
        return [...prev, ...Array(tickets - prev.length).fill("")];
      } else if (tickets < prev.length) {
        return prev.slice(0, tickets);
      }
      return prev;
    });
  }, [tickets]);

  // --------- Booking enable/disable logic ---------
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

  useEffect(() => {
    if (!product?.date) {
      setIsBookEnabled(false);
      return;
    }

    const compute = () => {
      const now = new Date();

      // 🚫 If seats are not available -> disable immediately
      if (product?.seatAvailable === false) {
        setIsBookEnabled(false);
        return;
      }

      const showDateOnly = parseDateString(product.date);
      if (!showDateOnly || isNaN(showDateOnly.getTime())) {
        setIsBookEnabled(false);
        return;
      }

      const todayDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const showDateOnlyKey = new Date(showDateOnly.getFullYear(), showDateOnly.getMonth(), showDateOnly.getDate());

      if (showDateOnlyKey < todayDateOnly) {
        setIsBookEnabled(false);
        return;
      }

      if (showDateOnlyKey > todayDateOnly) {
        setIsBookEnabled(true);
        return;
      }

      // Same-day -> check time
      if (!product?.time) {
        setIsBookEnabled(false);
        return;
      }

      const showDateTime = combineDateTime(product.date, product.time);
      if (!showDateTime || isNaN(showDateTime.getTime())) {
        setIsBookEnabled(false);
        return;
      }

      const cutoff = new Date(showDateTime.getTime() - 60 * 60 * 1000);
      setIsBookEnabled(now < cutoff);
    };

    compute();
    const id = setInterval(compute, 30000);
    return () => clearInterval(id);
  }, [product?.date, product?.time, product?.seatAvailable]);

  if (!product) return <h2>No product details found.</h2>;

  const total = tickets * unitCost;

  const incrementTickets = () => setTickets((n) => n + 1);
  const decrementTickets = () => setTickets((n) => (n > 1 ? n - 1 : 1));
  const handleTicketInput = (e) => {
    const v = Math.max(1, parseInt(e.target.value || "1", 10));
    setTickets(v);
  };

  const handleNameChange = (index, value) => {
    setTicketHolders((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const validate = () => {
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      alert("Please enter a valid email.");
      return false;
    }
    if (!mobile.trim() || !/^\d{10}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return false;
    }
    if (ticketHolders.some((n) => !n || !n.trim())) {
      alert("Please enter all ticket holder names.");
      return false;
    }
    return true;
  };

  const handleBookNow = async () => {
    if (!validate()) return;

    try {
      
      const response = await axiosInstance.post("/api/payment/create-order", {
        amount: total,
      });

      const order = response.data.order || response.data;

      if (!order.id) {
        alert("Failed: No order ID from backend");
        return;
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: product.name,
        description: "Ticket Booking",
        order_id: order.id,
        handler: async function (response) {
          try {
            const bookingData = {
              showId: product.id || product._id,
              email,
              mobile,
              ticketHolders,
              ticketsCount: tickets,
              totalAmount: total,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            };

            const bookRes = await axiosInstance.post("/api/tickets/book", bookingData);

            if (bookRes.data.success) {
              const ticket = bookRes.data.ticket;
              const showDetailsForEmail = {
                name: product.name,
                date: product.date,
                place: product.place,
                hall: product.hall,
                showType: product.showType || "General",
                time: product.time,
                cost: unitCost,
              };

              // ✅ Try to send email, but don't fail if it doesn't work
              try {
               
                await axiosInstance.post("/api/email/send-ticket-email", {
                  ticket,
                  showDetails: showDetailsForEmail,
                });
                console.log("✅ Email sent successfully");
              } catch (emailError) {
                console.warn("⚠️ Email sending failed, but booking was successful:", emailError.response?.data?.message || emailError.message);
                alert("Booking successful! However, confirmation email could not be sent. Your ticket details are available on the next screen.");
              }

              // ✅ Navigate regardless of email success/failure
              navigate("/ticket", {
                state: {
                  ticket,
                  showDetails: showDetailsForEmail,
                },
              });
            } else {
              alert("Booking failed: " + (bookRes.data.message || "Try again."));
            }
          } catch (err) {
            console.error("Booking error:", err);
            alert("Error saving booking.");
          }
        },
        prefill: { email, contact: mobile },
        theme: { color: "#ed974c" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("AXIOS ERROR:", err.response ? err.response.data : err.message);
      alert("Failed to create payment order.");
    }
  };
  return (
    <div className="container py-5">
      <div className="card shadow-lg p-4" style={{ borderRadius: "20px" }}>
        <div className="row g-4">
        
          <div className="col-md-6">
            <img
              src={product.image1}
              alt={product.name}
              className="img-fluid rounded"
              style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }}
            />
          </div>

       
          <div className="col-md-6 d-flex flex-column">
            <h2 style={{ color: "#ed974c" }}>{product.name}</h2>
            <p>{product.description}</p>
            <p><strong>📍 Place:</strong> {product.place}</p>
            <p><strong>🏛 Hall:</strong> {product.hall}</p>
            <p><strong>🎭 Show Type:</strong> {product.showType || "General"}</p>
            <p><strong>📅 Date:</strong> {product.date}</p>
            <p><strong>⏰ Time:</strong> {product.time}</p>
            <p><strong>💰 Ticket Cost:</strong> ₹{unitCost}</p>
            <p><strong>🪑 Seats:</strong> {product.seatAvailable ? "Available ✅" : "Not Available ❌"}</p>

            <div className="d-flex align-items-center gap-3 mt-3">
              <button className="btn btn-outline-secondary" onClick={decrementTickets}>-</button>
              <input
                type="number"
                min={1}
                value={tickets}
                onChange={handleTicketInput}
                className="form-control"
                style={{ width: 80, textAlign: "center" }}
              />
              <button className="btn btn-outline-secondary" onClick={incrementTickets}>+</button>
            </div>

            <div className="mt-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />

              <label className="form-label mt-2">Mobile</label>
              <input
                type="tel"
                className="form-control"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit number"
              />
            </div>

            <div className="mt-3">
              <h5>Ticket Holder Names</h5>
              {ticketHolders.map((name, idx) => (
                <input
                  key={idx}
                  type="text"
                  className="form-control mt-2"
                  placeholder={`Name for Ticket ${idx + 1}`}
                  value={name}
                  onChange={(e) => handleNameChange(idx, e.target.value)}
                />
              ))}
            </div>

            <p className="mt-3"><strong>Total:</strong> ₹{tickets * unitCost}</p>

            <button
              className="bannerBtn mt-4"
              onClick={handleBookNow}
              disabled={!isBookEnabled}
            >
              {isBookEnabled ? "Book Now" : "Booking Closed"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreDetails;
