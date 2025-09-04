import React from "react";
import { useState } from "react";
import '../assets/css/App.css';
import glass from "../assets/img/search.png";

function SearchBar(){

    const [query, setQuery] = useState("");

    const search = (e) =>{
        if (e.type === "keydown" && e.key !== "Enter"){
        return;
    }

        console.log("Buscando:", query);
    }
    return (
        <div id="search_bar" className="sticky top-0 z-10 flex w-full p-4">
            <img    id="glass_icon"
                    onClick={search}
                    className="me-2 hover:cursor-pointer hover:drop-shadow-xl"
                    src={glass}
                    alt="Buscar"/>

            <input  id="search_bar_input"
                    onKeyDown={search}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border rounded-full w-11/12 ps-5" 
                    type="text"
                    placeholder="Busca empresas por nombre comercial, nombre fiscal o CIF"/>
        </div>
    )
}

export default SearchBar;