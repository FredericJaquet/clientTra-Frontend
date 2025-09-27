import React from "react";
import api from "../api/axios";
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate  } from "react-router-dom";
import '../assets/css/App.css';
import glass from "../assets/img/search.png";


function SearchBar(){

    const { t } = useTranslation();
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [customersSearchResult, setCustomersSearchResult] = useState([]);
    const [providersSearchResult, setProvidersSearchResult] = useState([]);

    const search = (e) => {
        if (e.type === "keydown" && e.key !== "Enter") return;

        api.get(`/customers/search?input=${query}`)
            .then((res) => setCustomersSearchResult(res.data))
            .catch((err) => console.error("Error fetching customers:", err));
    };

    // Effect for Customers
    useEffect(() => {
        if (customersSearchResult.length > 0) {
            if (customersSearchResult.length === 1) {
                navigate(`/dashboard/customers/${customersSearchResult[0].idCompany}`);
            } else {
                navigate(`/dashboard/customers?search=${query}`);
            }
        } else if (query !== "") {
            // If there is no customers, search for Providers
            api.get(`/providers/search?input=${query}`)
                .then((res) => setProvidersSearchResult(res.data))
                .catch((err) => console.error("Error fetching providers:", err));
        }
    }, [customersSearchResult]);

    // effect for Providers
    useEffect(() => {
        if (providersSearchResult.length > 0) {
            if (providersSearchResult.length === 1) {
                navigate(`/dashboard/providers/${providersSearchResult[0].idProvider}`);
            } else {
                navigate(`/dashboard/providers?search=${query}`);
            }
        }
    }, [providersSearchResult]);



    return (
        <div id="search_bar" className="bg-[color:var(--primary)] sticky top-0 z-10 flex w-full p-4">
            <img    id="glass_icon"
                    onClick={search}
                    className="me-2 h-10 hover:cursor-pointer hover:drop-shadow-xl"
                    src={glass}
                    alt="Buscar"/>

            <input  id="search_bar_input"
                    onKeyDown={search}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border bg-[color:var(--background)] rounded-full w-11/12 ps-5" 
                    type="text"
                    placeholder={t('dashboard.search_bar')}/>
        </div>
    )
}

export default SearchBar;