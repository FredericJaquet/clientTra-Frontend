import React from "react";
import { useState } from "react";
import '../assets/css/App.css';
import glass from "../assets/img/search.png";
import { useTranslation } from 'react-i18next';

function SearchBar(){

    const { t } = useTranslation();

    const [query, setQuery] = useState("");

    const search = (e) =>{
        if (e.type === "keydown" && e.key !== "Enter"){
        return;
    }

        console.log("Buscando:", query);
    }
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
                    className="border rounded-full w-11/12 ps-5" 
                    type="text"
                    placeholder={t('dashboard.search_bar')}/>
        </div>
    )
}

export default SearchBar;