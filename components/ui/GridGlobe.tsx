import React from "react";
import { World } from "./Globe";

const GridGlobe = () => {
  return (
    <div className="flex items-center justify-center absolute -left-5 top-36 md:top-40 w-full h-full">
      {/* remove h-full md:h-[40rem] */}
      <div className="max-w-7xl mx-auto w-full relative overflow-hidden h-96 px-4">
        <div className="absolute w-full bottom-0 inset-x-0 h-40 bg-gradient-to-b pointer-events-none select-none from-transparent dark:to-black to-white z-40" />
        {/* remove -bottom-20 */}
        <div className="absolute w-full h-72 md:h-full z-10">
          <World />
        </div>
      </div>
    </div>
  );
};
export default GridGlobe;
