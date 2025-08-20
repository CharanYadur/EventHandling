import React from 'react';
import { motion } from 'framer-motion';

const FooterSection = () => {
    const zoomVariant = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <footer className="footer bg-dark text-white py-5">
            <div className="container">
                <div className="row">
                    <motion.div
                        className="col-md-4"
                        variants={zoomVariant}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.3 }}
                    >
                        <h5 style={{ fontFamily: "'Pacifico', cursive" }}>EventBright</h5>
                        <p>Your trusted platform to explore and book amazing shows & events.</p>
                    </motion.div>

                    <motion.div
                        className="col-md-4"
                        variants={zoomVariant}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.3 }}
                    >
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><a href="/" className="text-light">Home</a></li>
                            <li><a href="/properties" className="text-light">Browse Shows</a></li>
                            <li><a href="/aboutUs" className="text-light">About Us</a></li>
                            <li><a href="/contactUs" className="text-light">Admin</a></li>
                        </ul>
                    </motion.div>

                    <motion.div
                        className="col-md-4"
                        variants={zoomVariant}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.3 }}
                    >
                        <h5>Contact Info</h5>
                        <p>📧 support@charankumar.com</p>
                        <p>📞 +91 9449551297</p>
                        <p>📍 Bengaluru, India</p>
                    </motion.div>
                </div>

                <hr className="my-4" />
                <div className="text-center">
                    <p>&copy; {new Date().getFullYear()} EventBright. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default FooterSection;
