import React, { Fragment } from "react";

import Search from "../Search/Search";
import RickAndMortyLogo from "../../assets/img/rick-and-morty-icon-48x48.png";

/** Component's props */
interface SearchBarProps {
    handleSearch: (query: string) => void;
    searchQuery: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ handleSearch, searchQuery }) => {
    return (
        <Fragment>
            <div className="characters-list__search-bar-wrapper sticky top-0 flex flex-col md:flex-row items-center md:justify-between w-full py-4 bg-white z-10">
                {/* Logo */}
                <a
                    href="https://rickandmortyapi.com/documentation/"
                    target="_blank"
                    rel="noreferrer"
                    className="characters-list__logo-link inline-block transition-opacity duration-500 ease-in-out hover:opacity-60"
                >
                    <div className="characters-list__logo-wrapper w-12 h-12 my-4 md:my-0">
                        <img
                            src={RickAndMortyLogo}
                            alt="Rick and Morty"
                            className="characters-list__logo block w-full h-full"
                        />
                    </div>
                </a>

                {/* Search */}
                <Search handleSearch={handleSearch} searchQuery={searchQuery} />
            </div>
        </Fragment>
    );
};

export default SearchBar;
