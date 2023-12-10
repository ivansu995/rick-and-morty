import { configureStore } from "@reduxjs/toolkit";
import charactersReducer from "./slices/charactersSlice";

/**
 * Configure and create the Redux store
 *
 * The store is configured with Redux Toolkit's configureStore
 */
export const store = configureStore({
    /** Map of the reducers */
    reducer: {
        characters: charactersReducer,
    },
});

/**
 * RootState type
 *
 * A TypeScript type that represents the state shape of the Redux store
 * Useful for type-checking the Redux state and selectors
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * AppDispatch type
 *
 * A TypeScript type for the Redux store's dispatch function
 * Useful for type-checking the dispatch function, especially in components
 */
export type AppDispatch = typeof store.dispatch;
