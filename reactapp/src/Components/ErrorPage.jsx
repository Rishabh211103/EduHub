
import React from 'react';

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <figure className="px-10 pt-10">
          <img src="/alert.png" alt="Error Alert" className="w-24 h-24" />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title text-2xl font-bold">Oops! Something Went Wrong</h2>
          <p className="text-base-content/70">Please try again later.</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;