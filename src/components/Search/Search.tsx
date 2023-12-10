import React, {
    Fragment,
    ChangeEvent,
    useEffect,
    useRef,
    useState,
} from "react";

/** Component props */
interface SearchProps {
    handleSearch: (query: string) => void;
    searchQuery: string;
}

/** Search component
 * Renders text input for searching
 *
 * - handleSearch function is called with the search query whenever input changes
 */

const Search: React.FC<SearchProps> = ({ handleSearch, searchQuery }) => {
    /** Ref for imnput element */
    const inputRef = useRef<HTMLInputElement>(null);

    /** State for input value */
    const [inputValue, setInputValue] = useState(searchQuery);

    /** Effect to automatically focus input when the component mounts or when searchQuery changes */
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [searchQuery]);

    /** Handler for input changes calls handleSearch function */
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        handleSearch(event.target.value);
    };

    /** Clear search input */
    const onClearInput = () => {
        setInputValue("");
        handleSearch("");
        inputRef.current?.focus();
    };

    return (
        <Fragment>
            <div className="searc-bar relative h-full w-full md:w-auto">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={onChange}
                    className="search-bar__input w-full py-2 px-4 border border-gray-400 rounded-lg focus:outline-none"
                />

                {inputValue && (
                    <button
                        onClick={onClearInput}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600"
                    >
                        <svg
                            viewBox="0 -960 960 960"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                        </svg>
                    </button>
                )}
            </div>
        </Fragment>
    );
};

export default Search;
