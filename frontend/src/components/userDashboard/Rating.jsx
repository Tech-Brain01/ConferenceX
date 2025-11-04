import { useState } from "react";

const Rating = ({ rating, setRating, size = 24 }) => {
  const [hoveredStar, setHoveredStar] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoveredStar(star)}
          onMouseLeave={() => setHoveredStar(0)}
          className="transition-transform"
          style={{
            fontSize: size,
            color:
              star <= (hoveredStar || rating) ? "#FBBF24" : "#D1D5DB",
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default Rating;
