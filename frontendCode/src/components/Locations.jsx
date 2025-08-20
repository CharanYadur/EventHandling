import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../AxiousConfig';

const Locations = () => {
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchShows = async () => {
            try {
                setLoading(true);
               
                const { data } = await axiosInstance.get("/api/shows");
                console.log("Location page Data", data)

                
                const groupedData = data.reduce((acc, show) => {
                    const hall = show.hall;  

                    if (!acc[hall]) {
                        acc[hall] = {
                            name: hall,
                            image: show.auditoriumImage, 
                            description: `Explore shows happening at ${hall}`,
                            properties: []
                        };
                    }

                    acc[hall].properties.push({
                        id: show._id,
                        title: show.name,
                        shortDescription: show.shortDescription,
                        address: show.place, 
                        price: `₹${show.cost}/ticket`,
                        size: hall,
                        type: show.showType,
                        // Availability: show.seatAvailable ? "Seats Available" : "Sold Out",
                        availableFrom: show.date,
                        features: [
                            `${show.startTime} - ${show.endTime}`,
                            show.showType,
                            show.seatAvailable ? "Seats Available" : "Sold Out"
                        ],
                        image: show.auditoriumImage,
                        image1: show.image1 || show.image2,
                        image2: show.image2 || show.image1,
                        shortDescription: show.shortDescription,
                        hall: hall,
                        place: show.place,
                        startTime: show.startTime,
                        endTime: show.endTime,
                        showType: show.showType,
                        seatAvailable: show.seatAvailable,
                        addedDate: show.addedDate
                    });

                    return acc;
                }, {});


                const locationsArray = Object.values(groupedData);
                setLocations(locationsArray);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching shows:", error);
                setError("Failed to load shows");
                setLoading(false);
            }
        };

        fetchShows();
    }, []);

    const handleCardClick = (location) => {
        navigate('/propertyDetails', { state: location });
    };

    if (loading) {
        return (
            <section className="py-5">
                <div className="container">
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading shows...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-5">
                <div className="container">
                    <div className="text-center">
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-5">
            <div className="container">
                <motion.h2
                    className="text-center fw-bold mb-4"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Explore by Auditorium
                </motion.h2>
                <div className="row">
                    {locations.map((location, index) => (
                        <motion.div
                            key={index}
                            className="col-sm-6 col-md-4 col-lg-4 mb-4"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            viewport={{ once: false, amount: 0.5 }}
                            onClick={() => handleCardClick(location)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div
                                className="card location-card h-100 shadow-sm py-3"
                                style={{
                                    borderRadius: "20px",
                                    overflow: 'hidden',
                                    backgroundColor: "#2d3337"
                                }}
                            >
                                
                                <div className="card-body text-center">
                                    <h5 style={{ color: "#fff" }}
                                        className="card-title d-flex justify-content-center align-items-center gap-2 fw-semibold"

                                    >
                                        <FaMapMarkerAlt style={{ color: "#ed974c" }} />
                                        {location.name}
                                    </h5>
                                    <p className=" small" style={{ color: "#fff" }}>
                                        {location.properties.length} show{location.properties.length !== 1 ? 's' : ''} available
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {locations.length === 0 && !loading && (
                    <div className="text-center">
                        <p className="text-muted">No shows available at the moment.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Locations;