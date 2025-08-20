import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PropertiesCard from './PropertiesCard';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { DatePicker } from 'antd';
import 'antd/dist/reset.css';
import axiosInstance from '../AxiousConfig';
import dayjs from 'dayjs';

const NewlyAdded = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedShowType, setSelectedShowType] = useState("");
  const [selectedDate, setSelectedDate] = useState(null); 

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const { data } = await axiosInstance.get("/api/shows");
        console.log("Show Data", data);

        const mappedData = data.map((item) => {
          const today = new Date();
          const addedDate = new Date(item.addedDate);

          const isToday =
            addedDate.getFullYear() === today.getFullYear() &&
            addedDate.getMonth() === today.getMonth() &&
            addedDate.getDate() === today.getDate();

          return {
            id: item._id,
            name: item.name,
            description: item.shortDescription,
            price: item.hall?.length * 100 || 1000,
            showType: item.showType,
            cost: item.cost,
            image1: item.image1 || item.image2,
            image2: item.image2 || item.image1,
            freshness: isToday ? "new" : "",
            place: item.place,
            hall: item.hall,
            date: dayjs(item.date).format('MM/DD/YYYY'), 
            time: `${item.startTime} - ${item.endTime}`,
            seatAvailable: item.seatAvailable,
            addedDate: item.addedDate,
          };
        });

        console.log("Mapped data", mappedData);
        setProperties(mappedData);
      } catch (error) {
        console.error("Error fetching shows:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  const showTypes = [...new Set(properties.map((p) => p.showType).filter(Boolean))];

  const filteredProperties = properties.filter((property) => {
    const searchTerm = search.toLowerCase();
    const matchesSearch =
      property.name?.toLowerCase().includes(searchTerm) ||
      property.place?.toLowerCase().includes(searchTerm) ||
      property.hall?.toLowerCase().includes(searchTerm);

    const matchesShowType =
      !selectedShowType || property.showType === selectedShowType;

    const matchesDate =
      !selectedDate || property.date === dayjs(selectedDate).format('MM/DD/YYYY'); 

    return matchesSearch && matchesShowType && matchesDate;
  });

  const sliderSettings = {
    dots: true,
    infinite: filteredProperties.length > 4,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3, infinite: filteredProperties.length > 3 } },
      { breakpoint: 992, settings: { slidesToShow: 2, infinite: filteredProperties.length > 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1, infinite: filteredProperties.length > 1 } }
    ]
  };

  return (
    <section className="py-5">
      <div className="px-3 px-md-5">
        <motion.h3
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="display-6 fw-bold text-center mb-4"
          style={{ color: "#2d3337" }}
        >
          Recommended Shows
        </motion.h3>

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
          <input
            type="text"
            className="form-control w-100 w-md-33"
            placeholder="Search by name, place, hall..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <DatePicker
            className="w-100 w-md-33"
            value={selectedDate ? dayjs(selectedDate) : null}
            onChange={(date) => setSelectedDate(date ? date.toDate() : null)}
            format="MM/DD/YYYY"
            allowClear
          />

          <div>
            <select
              className="form-select w-100 w-md-auto"
              value={selectedShowType}
              onChange={(e) => setSelectedShowType(e.target.value)}
            >
              <option value="">All</option>
              {showTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: "#2d3337",
            padding: "30px",
            borderRadius: "30px",
            minHeight: "350px"
          }}
        >
          {loading ? (
            <div className="row g-4 justify-content-center">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="col-12 col-sm-6 col-lg-3 d-flex justify-content-center">
                  <div style={{ width: "100%", maxWidth: "300px" }}>
                    <PropertiesCard loading={true} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProperties.length > 0 ? (
            filteredProperties.length > 4 ? (
              <Slider {...sliderSettings}>
                {filteredProperties.map((property) => (
                  <div key={property.id} className="px-2">
                    <div style={{ minHeight: "100%" }}>
                      <PropertiesCard product={property} loading={false} />
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="row g-4 justify-content-center">
                {filteredProperties.map((property) => (
                  <div
                    key={property.id}
                    className="col-12 col-sm-6 col-lg-3 d-flex justify-content-center"
                  >
                    <div style={{ width: "100%", maxWidth: "300px" }}>
                      <PropertiesCard product={property} loading={false} />
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <p className="text-white text-center">No shows found.</p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default NewlyAdded;
