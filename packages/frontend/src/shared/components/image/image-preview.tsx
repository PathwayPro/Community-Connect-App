'use client';

import { useState, useMemo, useCallback, memo } from 'react';
import Image from 'next/image';

interface ImagePreviewProps {
  imagePath?: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackImage?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
}

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
export const ImagePreview = memo(
  ({
    imagePath = '',
    alt = 'News image',
    width = 400,
    height = 300,
    className = '',
    fallbackImage = '/news/3.png',
    fill = false,
    priority = false,
    sizes = '(max-width: 768px) 100vw, 50vw'
  }: ImagePreviewProps) => {
    const [imgError, setImgError] = useState(false);

    /**
     * Memoized image URL calculation to prevent Next.js Image src changes
     */
    const imageUrl = useMemo(() => {
      if (imgError || !imagePath || imagePath.includes('undefined')) {
        return fallbackImage;
      }
      return `${process.env.NEXT_PUBLIC_API_URL}/files/${imagePath}`;
    }, [imgError, imagePath, fallbackImage]);

    const handleError = useCallback(() => {
      setImgError(true);
    }, []);

    return (
      <div className={`relative ${!fill ? 'h-auto w-auto' : 'h-full w-full'}`}>
        <Image
          src={imageUrl}
          alt={alt}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          className={`rounded-xl object-cover ${className}`}
          onError={handleError}
          fill={fill}
          priority={priority}
          sizes={sizes}
        />
      </div>
    );
  }
);

ImagePreview.displayName = 'ImagePreview';
