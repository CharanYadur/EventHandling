import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import './components/style.css'
import PropertyDetails from './components/PropertyDetails';
import BrowseProperties from './components/BrowseProperties';
import FooterSection from './components/FooterSection';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import AdminLogin from './components/AdminLogin';
import MoreDetails from './components/MoreDetails';
import Ticket from './components/Ticket';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/propertyDetails" element={<PropertyDetails />} />
        <Route path="/properties" element={<BrowseProperties />} />
        <Route path="/aboutUs" element={<AboutUs />} />
         <Route path="/ticket" element={<Ticket />} />
        
        {/* First go to AdminLogin when /contactUs is clicked */}
        <Route path="/contactUs" element={<AdminLogin />} /> 
        
        {/* Separate route for actual ContactUs page after login */}
        <Route path="/admin/contactUs" element={<ContactUs />} />
        <Route path="/viewMore" element={<MoreDetails />} />
      </Routes>
      <FooterSection />
    </>
  );
}

export default App;
