'use client';

import { useState } from 'react';
import Image from 'next/image';
import { env } from '@/env.mjs';

/**
 * NewsImage Component
 * Displays an image from the backend with proper error handling and loading states
 *
 * @param {Object} props - Component properties
 * @param {string} props.imagePath - The image path returned from the backend (path/fileName)
 * @param {string} props.alt - Alt text for the image
 * @param {number} props.width - Width of the image (default: 400)
 * @param {number} props.height - Height of the image (default: 300)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.fallbackImage - Fallback image URL to use if the main image fails to load
 * @param {boolean} props.fill - Whether to fill the container (default: false)
 * @param {boolean} props.priority - Whether to prioritize loading (default: false)
 * @param {string} props.sizes - Responsive image sizes (default: "(max-width: 768px) 100vw, 50vw")
 * @returns {JSX.Element} - The NewsImage component
 */
export const ImagePreview = ({
  imagePath = '',
  alt = 'News image',
  width = 400,
  height = 300,
  className = '',
  fallbackImage = '/public/news/3.png',
  fill = false,
  priority = false,
  sizes = '(max-width: 768px) 100vw, 50vw'
}) => {
  const [imgError, setImgError] = useState(false);

  /**
   * Gets the correct image URL based on the path
   * @param {string | undefined} path - The image path
   * @returns {string} - The complete image URL
   */
  const getImageUrl = (path: string | undefined) => {
    // If error occurred or no image path or if it contains 'undefined', return fallback
    if (imgError || !path || path.includes('undefined')) {
      return fallbackImage;
    }

    // If the image path starts with a slash, it's a relative path
    if (path.startsWith('/')) {
      return path;
    }

    // Otherwise, construct the full URL with the API base URL
    return `${env.NEXT_PUBLIC_API_URL}/files/${path}`;
  };

  const handleError = () => {
    setImgError(true);
  };

  return (
    <div className={`relative ${!fill ? 'h-auto w-auto' : 'h-full w-full'}`}>
      <Image
        src={getImageUrl(imagePath)}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={`object-cover ${className}`}
        onError={handleError}
        fill={fill}
        priority={priority}
        sizes={sizes}
      />
    </div>
  );
};
