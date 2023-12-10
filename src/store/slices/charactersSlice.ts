import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/** Interface for character details */
interface Character {
    id: number;
    name: string;
    status: string;
    species: string;
    type: string;
    gender: string;
    origin: { name: string; url: string };
    location: { name: string; url: string };
    image: string;
    episode: string[];
    url: string;
    created: string;
}
/** Interface for pagination info */
interface Info {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
}

/** Interface for API response */
interface CharactersApiResponse {
    info: Info;
    results: Character[];
}

/**
 * asyncThunk action to fetch characters from the API
 * @see https://rickandmortyapi.com/documentation/#get-all-characters
 *
 * Accepts parameters for pagination, search query, and status filter
 */
export const fetchCharacters = createAsyncThunk(
    "characters/fetchCharacters",
    async ({
        pageNumber = 1,
        name = "",
        status = "",
        isNewData = false,
    }: {
        pageNumber?: number;
        name?: string;
        status?: string;
        isNewData?: boolean;
    }) => {
        /** Construct the query string */
        const queryParts = [];
        if (name && name.trim() !== "") {
            queryParts.push(`name=${encodeURIComponent(name.trim())}`);
        }
        if (status && status !== "any") {
            queryParts.push(`status=${encodeURIComponent(status)}`);
        }
        if (pageNumber !== 1) {
            queryParts.push(`page=${pageNumber}`);
        }
        const query = queryParts.join("&");

        const url = `https://rickandmortyapi.com/api/character?${query}`;
        const response = await axios.get<CharactersApiResponse>(url);
        return {
            characters: response.data.results,
            info: response.data.info,
        };
    }
);

/** State structure for characters slice */
interface CharactersState {
    characters: Character[];
    status: "idle" | "loading" | "failed";
    info: Info | null;
    isFetchingNewData: boolean;
}
/** Slice for managing characters state (data) */
const charactersSlice = createSlice({
    name: "characters",
    initialState: {
        characters: [],
        status: "idle",
        info: null,
        isFetchingNewData: false,
    } as CharactersState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCharacters.pending, (state, action) => {
                /** Set loading state and clear characters array if fetching new data */
                state.status = "loading";
                if (action.meta.arg.isNewData) {
                    /** Clear characters if it's a new search/filter */
                    state.characters = [];
                    state.isFetchingNewData = true;
                }
            })
            .addCase(fetchCharacters.fulfilled, (state, action) => {
                /** Set idle state and update characters array */
                state.status = "idle";
                const newCharacters = action.payload.characters.filter(
                    (newChar) =>
                        !state.characters.some(
                            (existingChar) => existingChar.id === newChar.id
                        )
                );
                /**
                 * Replace characters if it's a new search/filter,
                 *  or append characters for pagination
                 */
                state.characters = state.isFetchingNewData
                    ? newCharacters
                    : [...state.characters, ...newCharacters];
                /** Populate pagination info */
                state.info = action.payload.info;
                /** Reset flag */
                state.isFetchingNewData = false;
            })
            .addCase(fetchCharacters.rejected, (state) => {
                state.status = "failed";
                if (state.isFetchingNewData) {
                    /** Clear characters if it's a new search/filter */
                    state.characters = [];
                }
                /** Reset flag */
                state.isFetchingNewData = false;
            });
    },
});

export default charactersSlice.reducer;
