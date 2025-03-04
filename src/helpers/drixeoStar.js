import { TiStarFullOutline } from "react-icons/ti";

const DrixeoStar = () => {
	return (
    <svg width="25" height="25" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="20%" stopColor="rgba(137,115,237,1)" />
          <stop offset="75%" stopColor="rgba(36,101,213,1)" />
        </linearGradient>
        <mask id="mask1">
          <TiStarFullOutline size={20} style={{ fill: "white" }} />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad1)" mask="url(#mask1)" />
    </svg>		
		)
}

export default DrixeoStar