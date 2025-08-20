import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const ContactUs = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [shows, setShows] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loadingShows, setLoadingShows] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  
  const [searchShows, setSearchShows] = useState("");
  const [selectedShowType, setSelectedShowType] = useState("");
  const [selectedShowDate, setSelectedShowDate] = useState(null);
  const [searchTickets, setSearchTickets] = useState("");
  const [selectedTicketShow, setSelectedTicketShow] = useState("");
  
  const [newShow, setNewShow] = useState({
    name: "",
    date: "",
    shortDescription: "",
    place: "",
    hall: "",
    startTime: "",
    endTime: "",
    showType: "",
    cost: "",
    image1: "",
    image2: "",
    seatAvailable: true,
  });
  const [auditoriums, setAuditoriums] = useState([]);
  const [selectedAuditorium, setSelectedAuditorium] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const fetchShows = async () => {
    setLoadingShows(true);
    try {
      const res = await fetch("http://localhost:5000/api/shows");
      const data = await res.json();
      setShows(data);
    } catch (error) {
      console.error("Error fetching shows:", error);
    } finally {
      setLoadingShows(false);
    }
  };

  const fetchTickets = async () => {
    setLoadingTickets(true);
    try {
      const res = await fetch("http://localhost:5000/api/tickets");
      const data = await res.json();
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoadingTickets(false);
    }
  };

  const fetchAuditoriums = async () => {
    try {
      if (shows.length === 0) await fetchShows();
      const halls = Array.from(new Set(shows.map((s) => s.hall))).map((hall) => ({
        name: hall,
      }));
      setAuditoriums(halls);
    } catch (error) {
      console.error("Error fetching auditoriums:", error);
    }
  };

  const handleAddShow = async (e) => {
    e.preventDefault();
    try {
      if (editingShow) {
        await fetch(`http://localhost:5000/api/shows/${editingShow._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newShow),
        });
        setEditingShow(null);
      } else {
        await fetch("http://localhost:5000/api/shows", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newShow),
        });
      }
      setShowModal(false);
      setNewShow({
        name: "",
        date: "",
        shortDescription: "",
        place: "",
        hall: "",
        startTime: "",
        endTime: "",
        showType: "",
        cost: "",
        image1: "",
        image2: "",
        seatAvailable: true,
      });
      fetchShows();
    } catch (error) {
      console.error("Error saving show:", error);
    }
  };

  const renderSkeleton = (count = 3) => {
    const skeletons = [];
    for (let i = 0; i < count; i++) {
      skeletons.push(
        <div key={i} className="col-md-4 mb-3">
          <div className="card shadow-sm p-3 rounded-4">
            <div className="bg-secondary mb-2" style={{ height: 150 }}></div>
            <div className="bg-secondary mb-1" style={{ height: 20, width: "70%" }}></div>
            <div className="bg-secondary mb-1" style={{ height: 15, width: "50%" }}></div>
            <div className="bg-secondary mb-1" style={{ height: 15, width: "60%" }}></div>
          </div>
        </div>
      );
    }
    return <div className="row">{skeletons}</div>;
  };

  const getShowsForSelectedDate = () => {
    if (!selectedAuditorium || !selectedDate) return [];
    return shows.filter(
      (s) =>
        s.hall === selectedAuditorium.name &&
        new Date(s.date).toDateString() === selectedDate.toDateString() &&
        s.seatAvailable
    );
  };

  const getBookedTicketsCount = (showId) => {
    return tickets
      .filter((t) => t.show?._id === showId)
      .reduce((total, t) => total + (t.ticketsCount || t.ticketHolders?.length || 0), 0);
  };

  const showTypes = [...new Set(shows.map((s) => s.showType).filter(Boolean))];
  
  const showNames = [...new Set(shows.map((s) => s.name).filter(Boolean))];

  const filteredShows = shows.filter((show) => {
    const searchTerm = searchShows.toLowerCase();
    const matchesSearch = 
      show.name?.toLowerCase().includes(searchTerm) ||
      show.place?.toLowerCase().includes(searchTerm) ||
      show.hall?.toLowerCase().includes(searchTerm) ||
      show.shortDescription?.toLowerCase().includes(searchTerm);
    
    const matchesShowType = !selectedShowType || show.showType === selectedShowType;
    
    const matchesDate = !selectedShowDate || 
      new Date(show.date).toDateString() === new Date(selectedShowDate).toDateString();
    
    return matchesSearch && matchesShowType && matchesDate;
  });

  const filteredTickets = tickets.filter((ticket) => {
    const searchTerm = searchTickets.toLowerCase();
    const matchesSearch = 
      ticket.email?.toLowerCase().includes(searchTerm) ||
      ticket.mobile?.toLowerCase().includes(searchTerm) ||
      ticket.ticketHolders?.some(holder => holder.toLowerCase().includes(searchTerm)) ||
      ticket.show?.name?.toLowerCase().includes(searchTerm);
    
    const matchesShow = !selectedTicketShow || ticket.show?.name === selectedTicketShow;
    
    return matchesSearch && matchesShow;
  });

  useEffect(() => {
    fetchShows();
    fetchTickets();
  }, []);

  return (
    <div className="container-fluid p-0">
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark sticky-top">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <h5 className="text-white mb-0">Admin Dashboard</h5>
          <div className="dropdown">
            <button
              className="btn btn-dark"
              type="button"
              id="menuDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="menuDropdown">
              <li>
                <button className="dropdown-item" onClick={() => setActivePage("dashboard")}>
                  📊 Dashboard
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setActivePage("shows");
                    fetchShows();
                  }}
                >
                  🎭 Shows
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setActivePage("tickets");
                    fetchTickets();
                  }}
                >
                  🎟 Tickets
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setActivePage("auditoriums");
                    fetchAuditoriums();
                  }}
                >
                  🏛 Auditoriums
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-4">
        {/* Dashboard */}
        {activePage === "dashboard" && (
          <div className="p-4 bg-light rounded shadow-sm">
            <h4 className="mb-4">Welcome to EventEase Dashboard 🎉</h4>
            <div className="row g-3">
              <div className="col-md-3 col-6">
                <div className="card text-center shadow-sm p-3 rounded-4">
                  <h6 className="text-muted">🎭 Total Shows</h6>
                  <h4>{shows.length}</h4>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="card text-center shadow-sm p-3 rounded-4">
                  <h6 className="text-muted">✅ Available Shows</h6>
                  <h4>{shows.filter((s) => s.seatAvailable).length}</h4>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="card text-center shadow-sm p-3 rounded-4">
                  <h6 className="text-muted">⛔ Closed Shows</h6>
                  <h4>{shows.filter((s) => !s.seatAvailable).length}</h4>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="card text-center shadow-sm p-3 rounded-4">
                  <h6 className="text-muted">🎟 Tickets Booked</h6>
                  <h4>
                    {tickets.reduce(
                      (total, t) => total + (t.ticketsCount || t.ticketHolders?.length || 0),
                      0
                    )}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shows Page */}
        {activePage === "shows" && (
          <>
            <button
              className="btn btn-primary mb-3"
              onClick={() => {
                setShowModal(true);
                setEditingShow(null);
                setNewShow({
                  name: "",
                  date: "",
                  shortDescription: "",
                  place: "",
                  hall: "",
                  startTime: "",
                  endTime: "",
                  showType: "",
                  cost: "",
                  image1: "",
                  image2: "",
                  seatAvailable: true,
                });
              }}
            >
              ➕ Add Show
            </button>

            {/* Search and Filter Section for Shows */}
            <div className="row mb-4 g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="🔍 Search shows by name, place, hall..."
                  value={searchShows}
                  onChange={(e) => setSearchShows(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={selectedShowType}
                  onChange={(e) => setSelectedShowType(e.target.value)}
                >
                  <option value="">🎭 All Show Types</option>
                  {showTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <input
                  type="date"
                  className="form-control"
                  value={selectedShowDate || ""}
                  onChange={(e) => setSelectedShowDate(e.target.value || null)}
                />
              </div>
              <div className="col-md-2">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => {
                    setSearchShows("");
                    setSelectedShowType("");
                    setSelectedShowDate(null);
                  }}
                >
                  🔄 Clear
                </button>
              </div>
            </div>

            {/* Shows Results Count */}
            {(searchShows || selectedShowType || selectedShowDate) && (
              <div className="mb-3">
                <small className="text-muted">
                  Showing {filteredShows.length} of {shows.length} shows
                </small>
              </div>
            )}

            {loadingShows ? (
              renderSkeleton(6)
            ) : (
              <div className="row">
                {filteredShows.length === 0 ? (
                  <div className="col-12 text-center py-5">
                    <h5 className="text-muted">No shows found</h5>
                    <p className="text-muted">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  filteredShows.map((show) => (
                    <div key={show._id} className="col-md-4 mb-3">
                      <div className="card shadow-sm p-3 rounded-4">
                        {show.image1 && (
                          <img
                            src={show.image1}
                            alt="Show Img 1"
                            className="img-fluid rounded mb-2"
                            style={{ maxHeight: "150px", objectFit: "cover" }}
                          />
                        )}
                        {show.image2 && (
                          <img
                            src={show.image2}
                            alt="Show Img 2"
                            className="img-fluid rounded mb-2"
                            style={{ maxHeight: "150px", objectFit: "cover" }}
                          />
                        )}
                        <h5>{show.name}</h5>
                        <p>{show.shortDescription}</p>
                        <p>
                          <strong>📅 Date:</strong> {new Date(show.date).toDateString()}
                        </p>
                        <p>
                          <strong>🏛 Hall:</strong> {show.hall}
                        </p>
                        <p>
                          <strong>📍 Place:</strong> {show.place}
                        </p>
                        <p>
                          <strong>🎭 Type:</strong> {show.showType}
                        </p>
                        <p>
                          <strong>💰 Cost:</strong> ₹{show.cost}
                        </p>
                        <p>
                          <strong>
                            ⏰ {show.startTime} - {show.endTime}
                          </strong>
                        </p>
                        <p>
                          <strong>🎟 Tickets Booked:</strong> {getBookedTicketsCount(show._id)}
                        </p>
                        <div className="d-flex justify-content-end gap-2 mt-2">
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => {
                              setEditingShow(show);
                              setNewShow(show);
                              setShowModal(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={async () => {
                              if (window.confirm("Are you sure you want to delete this show?")) {
                                await fetch(`http://localhost:5000/api/shows/${show._id}`, {
                                  method: "DELETE",
                                });
                                fetchShows();
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {/* Tickets Page */}
        {activePage === "tickets" && (
          <>
            {/* Search and Filter Section for Tickets */}
            <div className="row mb-4 g-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="🔍 Search tickets by email, mobile, holder name..."
                  value={searchTickets}
                  onChange={(e) => setSearchTickets(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <select
                  className="form-select"
                  value={selectedTicketShow}
                  onChange={(e) => setSelectedTicketShow(e.target.value)}
                >
                  <option value="">🎭 All Shows</option>
                  {showNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => {
                    setSearchTickets("");
                    setSelectedTicketShow("");
                  }}
                >
                  🔄 Clear
                </button>
              </div>
            </div>

            {/* Tickets Results Count */}
            {(searchTickets || selectedTicketShow) && (
              <div className="mb-3">
                <small className="text-muted">
                  Showing {filteredTickets.length} of {tickets.length} tickets
                </small>
              </div>
            )}

            {loadingTickets ? (
              renderSkeleton(6)
            ) : (
              <div className="row">
                {filteredTickets.length === 0 ? (
                  <div className="col-12 text-center py-5">
                    <h5 className="text-muted">
                      {tickets.length === 0 ? "No tickets booked yet" : "No tickets found"}
                    </h5>
                    {tickets.length > 0 && (
                      <p className="text-muted">Try adjusting your search or filters</p>
                    )}
                  </div>
                ) : (
                  filteredTickets.map((ticket) => (
                    <div key={ticket._id} className="col-md-4 mb-3">
                      <div className="card shadow-sm p-3 rounded-4">
                        <h5>🎭 {ticket.show?.name}</h5>
                        <p>
                          <strong>📧 Email:</strong> {ticket.email}
                        </p>
                        <p>
                          <strong>📱 Mobile:</strong> {ticket.mobile}
                        </p>
                        <p>
                          <strong>👥 Holders:</strong> {ticket.ticketHolders.join(", ")}
                        </p>
                        <p>
                          <strong>🎟 Tickets:</strong> {ticket.ticketsCount}
                        </p>
                        <p>
                          <strong>💰 Total:</strong> ₹{ticket.totalAmount}
                        </p>
                        <p>
                          <strong>🆔 Payment:</strong> {ticket.paymentId || "N/A"}
                        </p>
                        <div className="d-flex justify-content-end">
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={async () => {
                              if (window.confirm("Are you sure you want to delete this ticket?")) {
                                await fetch(`http://localhost:5000/api/tickets/${ticket._id}`, {
                                  method: "DELETE",
                                });
                                fetchTickets();
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {/* Auditoriums Page */}
        {activePage === "auditoriums" && (
          <>
            {!selectedAuditorium ? (
              <div className="row">
                {auditoriums.map((aud, index) => (
                  <div key={index} className="col-md-3 mb-3">
                    <div
                      className="card shadow-sm p-3 rounded-4 text-center"
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedAuditorium(aud)}
                    >
                      <h5>🏛 {aud.name}</h5>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <button
                  className="btn btn-secondary mb-3"
                  onClick={() => {
                    setSelectedAuditorium(null);
                    setSelectedDate(null);
                  }}
                >
                  ← Back to Auditoriums
                </button>
                <Calendar
                  onChange={(date) => setSelectedDate(date)}
                  value={selectedDate}
                  tileClassName={({ date, view }) => {
                    const showDates = shows
                      .filter((s) => s.hall === selectedAuditorium.name && s.seatAvailable)
                      .map((s) => new Date(s.date).toDateString());
                    if (showDates.includes(date.toDateString())) {
                      return "bg-success text-white rounded";
                    }
                  }}
                />
                {selectedDate && (
                  <div className="mt-4">
                    <h5>Shows on {selectedDate.toDateString()}</h5>
                    {getShowsForSelectedDate().length === 0 ? (
                      <p>No shows available for this date.</p>
                    ) : (
                      <div className="row">
                        {getShowsForSelectedDate().map((s) => (
                          <div key={s._id} className="col-md-4 mb-3">
                            <div className="card shadow-sm p-3 rounded-4">
                              <h6>{s.name}</h6>
                              <p>
                                <strong>⏰ Time:</strong> {s.startTime} - {s.endTime}
                              </p>
                              <p>
                                <strong>🎭 Type:</strong> {s.showType}
                              </p>
                              <p>
                                <strong>💰 Cost:</strong> ₹{s.cost}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Add / Edit Show Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content p-4">
              <h4>{editingShow ? "Edit Show" : "Add New Show"}</h4>
              <form onSubmit={handleAddShow}>
                <input
                  type="text"
                  placeholder="Show Name"
                  className="form-control mb-2"
                  value={newShow.name}
                  onChange={(e) => setNewShow({ ...newShow, name: e.target.value })}
                  required
                />
                <input
                  type="date"
                  className="form-control mb-2"
                  value={newShow.date}
                  onChange={(e) => setNewShow({ ...newShow, date: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Short Description"
                  className="form-control mb-2"
                  value={newShow.shortDescription}
                  onChange={(e) =>
                    setNewShow({ ...newShow, shortDescription: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Place"
                  className="form-control mb-2"
                  value={newShow.place}
                  onChange={(e) => setNewShow({ ...newShow, place: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Hall"
                  className="form-control mb-2"
                  value={newShow.hall}
                  onChange={(e) => setNewShow({ ...newShow, hall: e.target.value })}
                  required
                />
                <input
                  type="time"
                  className="form-control mb-2"
                  value={newShow.startTime}
                  onChange={(e) => setNewShow({ ...newShow, startTime: e.target.value })}
                  required
                />
                <input
                  type="time"
                  className="form-control mb-2"
                  value={newShow.endTime}
                  onChange={(e) => setNewShow({ ...newShow, endTime: e.target.value })}
                  required
                />
                <select
                  className="form-control mb-2"
                  value={newShow.showType}
                  onChange={(e) => setNewShow({ ...newShow, showType: e.target.value })}
                  required
                >
                  <option value="">Select Show Type</option>
                  <option value="Singing Show">Singing Show</option>
                  <option value="Dance Show">Dance Show</option>
                  <option value="Drama">Drama</option>
                  <option value="Circus">Circus</option>
                  <option value="Comedy Show">Comedy Show</option>
                  <option value="Yakshagana">Yakshagana</option>
                  <option value="Seminar">Seminar</option>
                </select>
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={newShow.seatAvailable}
                    onChange={(e) =>
                      setNewShow({ ...newShow, seatAvailable: e.target.checked })
                    }
                  />
                  <label className="form-check-label">Seats Available</label>
                </div>
                <input
                  type="number"
                  placeholder="Ticket Cost (₹)"
                  className="form-control mb-2"
                  value={newShow.cost}
                  onChange={(e) => setNewShow({ ...newShow, cost: e.target.value })}
                  required
                />
                {/* Image 1 */}
                <div className="mb-2">
                  {newShow.image1 && (
                    <img
                      src={newShow.image1}
                      alt="Preview 1"
                      style={{ width: 120, marginBottom: 8, display: "block" }}
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control mb-2"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const base64 = await toBase64(file);
                        setNewShow({ ...newShow, image1: base64 });
                      }
                    }}
                    required={!editingShow || !newShow.image1}
                  />
                </div>
                {/* Image 2 */}
                <div className="mb-2">
                  {newShow.image2 && (
                    <img
                      src={newShow.image2}
                      alt="Preview 2"
                      style={{ width: 120, marginBottom: 8, display: "block" }}
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control mb-2"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const base64 = await toBase64(file);
                        setNewShow({ ...newShow, image2: base64 });
                      }
                    }}
                    required={!editingShow || !newShow.image2}
                  />
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={() => {
                      setShowModal(false);
                      setEditingShow(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    {editingShow ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactUs;