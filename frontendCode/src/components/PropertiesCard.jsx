import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaTheaterMasks, FaCalendarAlt, FaClock, FaBuilding } from "react-icons/fa";

const PropertiesCard = ({ product, loading }) => {
    const navigate = useNavigate();

    const viewMore = () => {
        if (product) navigate("/viewMore", { state: { product } });
    };

    if (loading) {
        return (
            <div className="mb-4">
                <div className="card h-100 position-relative skeleton-card">
                    <div className="skeleton-img"></div>
                    <div className="card-body">
                        <div className="skeleton-line w-60"></div>
                        <div className="skeleton-line w-80"></div>
                        <div className="skeleton-line w-50"></div>
                        <div className="skeleton-btn"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-4">
            <motion.div
                className="card product-card h-100 position-relative"
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                {/* NEW badge */}
                {product.freshness === "new" && (
                    <motion.div
                        className="position-absolute top-0 end-0 m-3 badge new-badge"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    >
                        NEW
                    </motion.div>
                )}

                {/* Image hover effect */}
                <motion.div
                    initial={{ scale: 0.95 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="position-relative rounded-4 overflow-hidden"
                >
                    <motion.img
                        src={product.image1}
                        className="card-img-top"
                        alt={product.name}
                        style={{ objectFit: 'cover', height: '250px' }}
                        initial={{ opacity: 1 }}
                        whileHover={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    />
                    <motion.img
                        src={product.image2 || product.image1}
                        className="card-img-top"
                        alt={product.name}
                        style={{ objectFit: 'cover', height: '250px', position: "absolute", top: 0, left: 0 }}
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    />
                </motion.div>

                {/* Card Body */}
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold" style={{ color: "#ed974c" }}>
                        {product.name}
                    </h5>
                    <p className="card-text text-muted small">{product.description}</p>

                    <div className="details text-muted small">
                        <p><FaMapMarkerAlt className="me-2 icon" /> {product.place}</p>
                         <p><FaBuilding className="me-2 icon" /> {product.hall}</p>
                        <p><FaTheaterMasks className="me-2 icon" /> {product.showType || "General"}</p>
                        <p><FaCalendarAlt className="me-2 icon" /> {product.date}</p>
                        <p><FaClock className="me-2 icon" /> {product.time}</p>
                    </div>

                    <div className="mt-auto">
                        <button className="bannerBtn w-100 modern-btn" onClick={viewMore}>
                            View More
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PropertiesCard;