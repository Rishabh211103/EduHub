import React from 'react'
import PropTypes from 'prop-types';


function SearchAndFilter({ onSearch, onFilter, searchPlaceholder, filterArr }) {
    return (
        <div>
            <div className="card bg-base-100 shadow-lg mb-6">
                <div className="card-body">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="form-control flex-1">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={searchPlaceholder || 'Search...'}
                                    className="input input-bordered w-full pl-10"
                                    onChange={(e) => onSearch(e.target.value)}
                                />
                                <svg
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="form-control sm:w-48">
                            <select
                                className="select select-bordered w-full"
                                onChange={(e) => onFilter(e.target.value === 'All' ? '' : e.target.value)}
                            >
                                {filterArr.map(item => (
                                    <option value={item.value}>{item.text}</option>
                                ))}
                                {/* <option value="All">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option> */}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

SearchAndFilter.propTypes = {
    onSearch: PropTypes.func.isRequired,
    onFilter: PropTypes.func.isRequired,
    searchPlaceholder: PropTypes.string,
    filterArr: PropTypes.array
};

export default SearchAndFilter