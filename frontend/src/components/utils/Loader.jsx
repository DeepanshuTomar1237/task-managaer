
import React from 'react'

// Loader component to display a spinning loader animation
const Loader = () => {
  return (
    <>
      {/* Container div for the loader, centered with margin and specific width/height */}
      <div className='w-8 h-8 my-8 mx-auto'>
        {/* The loader itself: a circular div with a border and animation */}
        <div className="w-full h-full rounded-full border-[3px] border-indigo-600 border-b-transparent animate-loader"></div>
      </div>
    </>
  )
}

export default Loader
