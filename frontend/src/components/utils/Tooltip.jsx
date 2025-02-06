import React, { useRef, useState } from 'react'
import ReactDom from 'react-dom';

// Portal component used to render the tooltip outside of its normal DOM hierarchy
const Portal = ({ children }) => {
  return ReactDom.createPortal(children, document.body);
}

// Tooltip component to show a floating tooltip near an element on hover
// @param children: It is expected to have only one child element that will trigger the tooltip when hovered over.
// @param text: The content of the tooltip that will be displayed.
// @param position: Determines where the tooltip will appear relative to the target element. Options: "top", "bottom", "left", "right". Default is "bottom".
// @param space: The distance between the target element and the tooltip. Default is 5px.
const Tooltip = ({ children, text, position = "bottom", space = 5 }) => {

  // Ensure that children is a valid React element. If not, default to the first element.
  if (!React.isValidElement(children)) {
    children = children[0];
  }

  // State to track whether the tooltip is open (visible)
  const [open, setOpen] = useState(false);
  
  // Refs to access the DOM elements of the tooltip and the target element
  const tooltipRef = useRef();
  const elementRef = useRef();

  // Mouse enter event to show the tooltip and calculate its position
  const handleMouseEnter = () => {
    setOpen(true);

    // Get the calculated position for the tooltip based on the target element's position and the desired position
    const { x, y } = getPoint(elementRef.current, tooltipRef.current, position, space);
    
    // Position the tooltip based on the calculated coordinates
    tooltipRef.current.style.left = `${x}px`;
    tooltipRef.current.style.top = `${y}px`;
  }

  // Function to calculate the position of the tooltip based on the target element's bounding box and the desired position
  const getPoint = (element, tooltip, position, space) => {
    const eleRect = element.getBoundingClientRect();
    const pt = { x: 0, y: 0 };

    switch (position) {
      case "bottom": {
        pt.x = eleRect.left + (element.offsetWidth - tooltip.offsetWidth) / 2;
        pt.y = eleRect.bottom + (space + 10);
        break;
      }
      case "left": {
        pt.x = eleRect.left - (tooltip.offsetWidth + (space + 10));
        pt.y = eleRect.top + (element.offsetHeight - tooltip.offsetHeight) / 2;
        break;
      }
      case "right": {
        pt.x = eleRect.right + (space + 10);
        pt.y = eleRect.top + (element.offsetHeight - tooltip.offsetHeight) / 2;
        break;
      }
      case "top": {
        pt.x = eleRect.left + (element.offsetWidth - tooltip.offsetWidth) / 2;
        pt.y = eleRect.top - (tooltip.offsetHeight + (space + 10));
        break;
      }
      default: {
        break;
      }
    }

    return pt;
  }

  // Tooltip styles including positioning and arrow styles based on position prop
  const tooltipClasses =
    `fixed transition ${open ? "opacity-100" : "opacity-0 "} pointer-events-none z-50 rounded-md bg-black text-white px-4 py-2 text-center w-max max-w-[150px]
      ${position === "top" && " after:absolute after:content-[''] after:left-1/2 after:top-full after:-translate-x-1/2 after:border-[10px] after:border-transparent after:border-t-black"}
      ${position === "bottom" && " after:absolute after:content-[''] after:left-1/2 after:bottom-full after:-translate-x-1/2 after:border-[10px] after:border-transparent after:border-b-black"}
      ${position === "left" && " after:absolute after:content-[''] after:top-1/2 after:left-full after:-translate-y-1/2 after:border-[10px] after:border-transparent after:border-l-black"}
      ${position === "right" && " after:absolute after:content-[''] after:top-1/2 after:right-full after:-translate-y-1/2 after:border-[10px] after:border-transparent after:border-r-black"}
    `;

  return (
    <>
      {/* Clone the child element to add event handlers for mouse enter and leave */}
      {React.cloneElement(children, {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: () => setOpen(false),
        ref: elementRef
      })}

      {/* Render the tooltip in a portal so it renders in the body */}
      <Portal>
        <div ref={tooltipRef} className={tooltipClasses}>{text}</div>
      </Portal>
    </>
  );
}

export default Tooltip;
