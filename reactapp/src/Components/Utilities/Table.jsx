import React from "react";
import PropTypes from 'prop-types';

function Tabel({
    headers,
    data,
    loading = false,
    error = null,
    emptyMessage = "No data found",
    renderRow,  //callback function
    className = ""
}) {
    return (
        <div className={`card bg-base-100 shadow-lg ${className}`}>
            <div className="card-body p-0">
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead className="bg-base-200">
                            <tr>
                                {headers.map((header, index) => (
                                    <th
                                        key={header.id || index}
                                        className={header.align ? `text-${header.align}` : 'text-left'}
                                        style={{ width: header.width }}
                                    >
                                        {header.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={headers.length} className="text-center py-12">
                                        <span className="loading loading-infinity loading-xl text-primary"></span>
                                        <p className="mt-4 text-gray-500">Loading data...</p>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={headers.length} className="text-center py-12">
                                        <div className="alert alert-error max-w-md mx-auto">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="stroke-current shrink-0 h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span>Error: {error}</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : data?.length === 0 ? (
                                <tr>
                                    <td colSpan={headers.length} className="text-center py-12">
                                        <div className="flex flex-col items-center gap-4">
                                            <svg
                                                className="w-16 h-16 text-gray-300"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                            <div>
                                                <p className="text-lg font-semibold text-gray-700">{emptyMessage}</p>
                                                <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                data.map((row, index) => renderRow(row, index))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

Tabel.propTypes = {
    headers: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    emptyMessage: PropTypes.string,
    renderRow: PropTypes.func.isRequired,
    className: PropTypes.string
};

// [
//     { label: 'SrNo', align: 'left' },
//     { label: 'Course Title', align: 'left' },
//     { label: 'Course Description', align: 'left' },
//     { label: 'Category', align: 'left' },
//     { label: 'Level', align: 'left' },
//     { label: 'Start Date', align: 'left' },
//     { label: 'End Date', align: 'center' },
//     { label: 'Actions', align: 'center' }
// ]

export default Tabel