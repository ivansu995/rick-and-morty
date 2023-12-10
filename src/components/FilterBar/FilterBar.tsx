import React, { Fragment, ChangeEvent } from "react";

/** Component's props */
interface FilterOption {
    label: string;
    value: string;
}

interface FilterBarProps {
    handleFilter: (query: string) => void;
    options: FilterOption[];
    selectedStatus: string;
}

/** FilterBar Component
 * Display a radio buttons for filtering charaters based on their status
 *
 * Props:
 *  - handleFilter: function to execute when a filter option is selected
 *  - options: array of filtered opitons
 */

const FilterBar: React.FC<FilterBarProps> = ({
    handleFilter,
    options,
    selectedStatus,
}) => {
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        handleFilter(event.target.value);
    };

    return (
        <Fragment>
            <div className="filter-bar py-4 px-2 text-base md:text-lg">
                <span className="filter-bar__name block md:inline">
                    Character status:
                </span>

                {options?.map((status, index) => (
                    <label
                        key={`${index}-${status.value}`}
                        className="filter-bar__label block md:inline md:px-2"
                    >
                        <input
                            type="radio"
                            name="characterStatus"
                            value={status.value}
                            checked={
                                selectedStatus === status.value ||
                                (selectedStatus === "" &&
                                    status.value === "any")
                            }
                            onChange={onChange}
                            className="filter-bar__input accent-blue-500"
                        />

                        <span className="filter-bar__status pl-1">
                            {status.label}
                        </span>
                    </label>
                ))}
            </div>
        </Fragment>
    );
};

export default FilterBar;
