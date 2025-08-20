import React, { useEffect, useState } from 'react';
import PropertiesCard from './PropertiesCard';
import axiosInstance from '../AxiousConfig';

const BrowseProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedShowType, setSelectedShowType] = useState("");

    useEffect(() => {
        const fetchShows = async () => {
            try {
               
                  const { data } = await axiosInstance.get("/api/shows");

                const mappedData = data.map(item => {
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
                        date: new Date(item.date).toLocaleDateString(),
                        time: `${item.startTime} - ${item.endTime}`,
                        seatAvailable: item.seatAvailable,
                        addedDate: item.addedDate,
                    };
                });

                setProperties(mappedData);
            } catch (error) {
                console.error("Error fetching shows:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchShows();
    }, []);

    const showTypes = [...new Set(properties.map(p => p.showType).filter(Boolean))];

    const filteredProperties = properties.filter(property => {
        const searchTerm = search.toLowerCase();
        const matchesSearch =
            property.name?.toLowerCase().includes(searchTerm) ||
            property.place?.toLowerCase().includes(searchTerm) ||
            property.hall?.toLowerCase().includes(searchTerm);

        const matchesShowType = !selectedShowType || property.showType === selectedShowType;

        return matchesSearch && matchesShowType;
    });

    const skeletonCards = Array.from({ length: 6 }).map((_, idx) => (
        <div className="col-md-4 mb-4" key={`skeleton-${idx}`}>
            <PropertiesCard loading={true} />
        </div>
    ));

    return (
        <div className="px-5 py-5" style={{ backgroundColor: "#f3ece5ff" }}>
            <h2 className="mb-4 text-center">Browse All Properties</h2>

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                <input
                    type="text"
                    className="form-control w-100 w-md-50"
                    placeholder="Search by name, place, hall..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
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

            <div className="row">
                {loading
                    ? skeletonCards
                    : filteredProperties.length > 0
                        ? filteredProperties.map(property => (
                            <div className="col-md-4 mb-4" key={property.id}>
                                <PropertiesCard product={property} loading={false} />
                            </div>
                        ))
                        : <p className="text-center">No properties found.</p>
                }
            </div>
        </div>
    );
};

export default BrowseProperties;
