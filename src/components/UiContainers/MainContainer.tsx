import React from 'react';

type MainContainerProps = {
  children: React.ReactNode;
};
const MainContainer: React.FC<MainContainerProps> = ({ children }) => {
  return (
    <div className="outer">
      <div className="inner">{children}</div>
    </div>
  );
};

export default MainContainer;
