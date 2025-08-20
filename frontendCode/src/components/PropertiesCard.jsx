
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PropertiesCard = ({ product, loading }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const navigate = useNavigate();

    const viewMore = () => {
        if (product) navigate("/viewMore", { state: { product } });
    };

    if (loading) {
        return (
            <div className="mb-4">
                <div className="card h-100 position-relative" style={{ borderRadius: "30px", height: "400px" }}>
                    <div className="bg-light rounded-4" style={{ height: '250px', margin: '20px' }}></div>
                    <div className="card-body">
                        <div className="bg-light mb-2" style={{ width: '60%', height: '20px', borderRadius: '4px' }}></div>
                        <div className="bg-light mb-2" style={{ width: '80%', height: '15px', borderRadius: '4px' }}></div>
                        <div className="bg-light mb-2" style={{ width: '50%', height: '15px', borderRadius: '4px' }}></div>
                        <div className="mt-auto bg-light" style={{ width: '100%', height: '35px', borderRadius: '8px' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-4">
            <div className="card product-card h-100 position-relative" style={{ borderRadius: "30px" }}>

               

                <div className='d-flex justify-content-between mt-3 ms-2'>
                    
                    {product.freshness === "new" && (
                        <motion.div
                            className="position-absolute top-0 end-0 m-2 badge"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            style={{ zIndex: 10, backgroundColor: "#ed974c" }}
                        >
                            NEW
                        </motion.div>
                    )}
                </div>


                <motion.div
                    initial={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="position-relative rounded-4"
                >
                    <motion.img
                        src={product.image1}
                        className="card-img-top"
                        alt={product.name}
                        style={{
                            objectFit: 'cover',
                            height: '250px',
                            padding: '20px',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%"
                        }}
                        initial={{ opacity: 1 }}
                        whileHover={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    />
                    <motion.img
                        src={product.image2 || product.image1}
                        className="card-img-top"
                        alt={product.name}
                        style={{
                            objectFit: 'cover',
                            height: '250px',
                            padding: '20px',
                            position: "relative",
                            width: "100%"
                        }}
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    />
                </motion.div>

                <div className="card-body d-flex flex-column">
                    <h5 className="card-title" style={{ color: "#ed974c" }}>{product.name}</h5>
                    <p className="card-text text-muted">{product.description}</p>

                    <small className="text-muted">
                        📍 {product.place} | 🏛 {product.hall} <br />
                        🎭 {product.showType || "General"} <br />
                        📅 {product.date} <br />
                        ⏰ {product.time}
                    </small>

                    <div className="mt-auto">
                        <button className="bannerBtn w-100" onClick={viewMore}>
                            View More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertiesCard;
