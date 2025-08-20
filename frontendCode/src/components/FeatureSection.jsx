import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaTicketAlt, FaClock, FaUsers } from 'react-icons/fa';

const features = [
    {
        icon: <FaStar size={32} />,
        title: 'Top-Rated Shows',
        description: 'Experience highly rated shows curated for quality entertainment.'
    },
    {
        icon: <FaTicketAlt size={32} />,
        title: 'Easy Ticket Booking',
        description: 'Book your tickets online quickly and securely with a few clicks.'
    },
    {
        icon: <FaClock size={32} />,
        title: 'Flexible Timings',
        description: 'Multiple show timings available to fit your schedule perfectly.'
    },
    {
        icon: <FaUsers size={32} />,
        title: 'Family & Friends Friendly',
        description: 'Enjoy shows with your loved ones in a safe and welcoming environment.'
    },
];

const FeatureSection = () => {
    return (
        <section className="py-5" style={{ background: "#2d3337" }}>
            <div className="container">
                <motion.h2
                    className="text-center mb-5 fw-bold"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ color: "#fff" }}
                >
                    Why Attend Our Shows?
                </motion.h2>

                <div className="row d-flex justify-content-center">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="col-sm-12 col-md-6 col-lg-3 mb-4 rhombusCard"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: false, amount: 0.5 }}
                        >
                            <div
                                className="card rhombus-wrapper shadow-sm"
                                style={{
                                    width: "100%",
                                    aspectRatio: "1/1",
                                    background: "#fff",
                                    transform: "rotate(45deg)",
                                    borderRadius: "20px",
                                    overflow: "hidden"
                                }}
                            >
                                <div
                                    className="rhombus-inner d-flex flex-column justify-content-center align-items-center text-center p-3"
                                    style={{ transform: "rotate(-45deg)", height: "100%", width: "100%" }}
                                >
                                    <div className="mb-3" style={{color:"#ed974c"}}>{feature.icon}</div>
                                    <h5 className="fw-semibold">{feature.title}</h5>
                                    <p className="text-muted">{feature.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
