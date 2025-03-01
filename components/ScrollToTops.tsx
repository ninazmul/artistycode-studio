"use client";

import ScrollToTop from "react-scroll-to-top";

const ScrollToTops = () => {
  return (
    <div>
      <ScrollToTop
        smooth
        top={100}
        color="#CBACF9"
        width="32"
        height="32"
        viewBox="0 0 256 256"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)", 
          WebkitBackdropFilter: "blur(5px)",
        }}
        className="custom-scroll-top"
      />
    </div>
  );
};

export default ScrollToTops;
