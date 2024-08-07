import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <main className="flex flex-auto justify-center items-center relative bottom-20 z-10">
      <div className="loader"></div>
    </main>
  );
};

export default LoadingSpinner;
