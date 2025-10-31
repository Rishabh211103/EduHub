import React from 'react'
import PropTypes from 'prop-types';


function Pagination({ totalPage = 1, currPage = 1, changePage }) {
    return (
        <div className="flex justify-center">
            <div className="join my-2">
                <button className="join-item btn" onClick={() => changePage(prev => Math.max(prev - 1, 1))} disabled={!(currPage - 1)}>«</button>
                <button className="join-item btn">Page {currPage}</button>
                <button className="join-item btn" onClick={() => changePage(prev => Math.min(prev + 1, totalPage))} disabled={(currPage === totalPage)}>»</button>
            </div>
        </div>
    )
}

Pagination.propTypes = {
    totalPage: PropTypes.number,
    currPage: PropTypes.number,
    changePage: PropTypes.func.isRequired
};

export default Pagination