'use client';

interface RatingProps {
  rating: number;
  maxRating?: number;
  className?: string;
}

export function Rating({ rating, maxRating = 5, className = '' }: RatingProps) {
  return (
    <div className={`flex gap-1 ${className}`}>
      {[...Array(maxRating)].map((_, index) => (
        <svg
          key={index}
          className={`h-5 w-5 ${
            index < rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-none text-yellow-400'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      ))}
    </div>
  );
}
