import React from "react";

const DimmedLoad: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-10">
      <div className="loader"></div>
    </div>
  );
};

export default DimmedLoad;
