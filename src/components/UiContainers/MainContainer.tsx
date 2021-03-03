import React from 'react';

const MainContainer: React.FC = ({ children }) => {
  return (
    <div className="outer">
      <div className="inner">{children}</div>
    </div>
  );
};

export default MainContainer;
