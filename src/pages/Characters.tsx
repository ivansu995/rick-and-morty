import React, { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
/** Router @see https://reactrouter.com/en/6.20.1/hooks/use-search-params */
import { useSearchParams } from "react-router-dom";

/** Store */
import { fetchCharacters } from "../store/slices/charactersSlice";
import { RootState } from "../store";
import { AppDispatch } from "../store";
/** Components import */
import SearchBar from "../components/SearchBar/SearchBar";
import FilterBar from "../components/FilterBar/FilterBar";
import CharacterCard from "../components/CharacterCard/CharacterCard";
import Spinner from "../components/ProgressSpinner/Spinner";

/** Options for the filter bar */
const characterStatusOptions = [
    { label: "Any", value: "any" },
    { label: "Alive", value: "alive" },
    { label: "Dead", value: "dead" },
    { label: "Unknown", value: "unknown" },
];

/**
 * CharactersList Component
 * Renders a list of characters, a search bar, and a filter bar
 * Implements infinite scrolling and pagination
 */
const CharactersList: React.FC = () => {
    /** Get the dispatch action and access the Redux store */
    const dispatch = useDispatch<AppDispatch>();

    /** Retrieve the state from the Redux store */
    // const characters = useSelector((state: RootState) => state.characters.characters);
    // const status = useSelector((state: RootState) => state.characters.status);
    // const info = useSelector((state: RootState) => state.characters.info);
    const { characters, status, info } = useSelector(
        (state: RootState) => state.characters
    );
    /**
     * State hooks for search query, filter status, current page,
     * and can fetch characters control
     **/
    const [currentPage, setCurrentPage] = useState(1);
    const [canFetchCharacters, setCanFetchCharacters] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    /**
     * @note Update: Instead of setting search query and filter status, extract them from URL
     * (implemented react-router-dom v6 & useSearchParams)
     * Extract search query and filter status from URL
     * and set them in the search bar and filter bar respectively
     */
    const searchQuery = searchParams.get("name") || "";
    const selectedStatus = searchParams.get("status") || "";
    /**
     * Effect to fetch characters based on search query,
     * status filter, and pagination
     */
    useEffect(() => {
        const statusFilter = selectedStatus !== "any" ? selectedStatus : "";
        dispatch(
            fetchCharacters({
                pageNumber: currentPage,
                name: searchQuery,
                status: statusFilter,
                isNewData: false,
            })
        );
    }, [dispatch, currentPage, searchQuery, selectedStatus]);

    /**
     * Infinite scroll effect to load more characters,
     * when the user scrolls to the bottom
     */
    useEffect(() => {
        /** Function to handle the scroll event */
        const handleScroll = () => {
            // If we're already in the process of fetching characters, exit
            if (!canFetchCharacters) return;
            /**
             * Calculate the distance from the bottom of the page
             * It's the difference between the total height of the page
             * and the sum of the height of the visible part of the page (window.innerHeight)
             * and how much the user has scrolled from the top (window.scrollY)
             */
            const bottomSpaceLeftToScroll =
                document.documentElement.scrollHeight -
                window.innerHeight -
                window.scrollY;

            /** If there's still space left to scroll down, exit */
            if (bottomSpaceLeftToScroll > 0) return;
            /** Check if there's more data to fetch based on the pagination info */
            if (info && currentPage < info?.pages) {
                /** Increase the current page number */
                setCurrentPage((prevPage) => prevPage + 1);
                /** Set canFetchCharacters to false to prevent multiple fetches at the same time */
                setCanFetchCharacters(false);
                /** Dispatch the fetchCharacters action to get the next page of characters */
                dispatch(
                    fetchCharacters({
                        pageNumber: currentPage + 1,
                        name: searchQuery,
                        status: selectedStatus,
                        isNewData: false,
                    })
                );
            }
        };
        /** Add the scroll event listener to the window object to trigger the handleScroll function */
        window.addEventListener("scroll", handleScroll);
        /** Cleanup function to remove the scroll event listener when the component unmounts */
        return () => window.removeEventListener("scroll", handleScroll);
    }, [
        canFetchCharacters,
        currentPage,
        dispatch,
        info,
        searchQuery,
        selectedStatus,
    ]);

    /** Effect to enable fetching more characters when the characters array is updated */
    useEffect(() => {
        if (characters.length) {
            setCanFetchCharacters(true);
        }
    }, [characters]);

    /** Handler for search input changes */
    const handleSearch = (query: string) => {
        const newSearchParams = new URLSearchParams();
        if (query) {
            newSearchParams.set("name", query);
        }
        if (selectedStatus && selectedStatus !== "any")
            newSearchParams.set("status", selectedStatus);
        setSearchParams(newSearchParams);
        setCurrentPage(1);
        const statusFilter = selectedStatus !== "any" ? selectedStatus : "";
        dispatch(
            fetchCharacters({
                pageNumber: 1,
                name: query.toLowerCase(),
                status: statusFilter,
                isNewData: true,
            })
        );
    };

    /** Handler for status filter changes */
    const handleFilter = (status: string) => {
        const newSearchParams = new URLSearchParams();
        if (searchQuery) newSearchParams.set("name", searchQuery);
        if (status && status !== "any") newSearchParams.set("status", status);
        setSearchParams(newSearchParams);
        setCurrentPage(1);
        dispatch(
            fetchCharacters({
                pageNumber: 1,
                name: searchQuery,
                status: status.toLowerCase(),
                isNewData: true,
            })
        );
    };

    /** Render the characters list */
    return (
        <Fragment>
            <div className="characters-list relative w-full h-full">
                <div className="characters-list__container w-full max-w-[1440px] px-4 mx-auto">
                    {/* Search Bar */}
                    <SearchBar
                        handleSearch={handleSearch}
                        searchQuery={searchQuery}
                    />

                    {/* Filter and Characters List Wrapper */}
                    <div className="characters-list__wrapper w-full h-full min-h-screen px-4 py-6 bg-gray-200">
                        {/* Filter Bar */}
                        <FilterBar
                            handleFilter={handleFilter}
                            options={characterStatusOptions}
                            selectedStatus={selectedStatus}
                        />

                        {/* Characters List */}
                        <div className="characters-list__card-wrapper grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
                            {characters?.map((character) => (
                                <CharacterCard
                                    key={`${character.id}-${character.name}`}
                                    character={character}
                                />
                            ))}
                        </div>

                        {/* Fallbacks for loading and error states */}
                        <div className="flex justify-center items-center py-4 md:py-8">
                            {/* Load More Characters */}
                            {info &&
                                currentPage < info?.pages &&
                                characters?.length > 0 && <Spinner />}

                            {/* No Characters Found */}
                            {status &&
                                status === "failed" &&
                                characters?.length === 0 && (
                                    <span className="text-center text-base md:text-xl font-semibold">
                                        No characters found. Please try a
                                        different search.
                                    </span>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default CharactersList;
