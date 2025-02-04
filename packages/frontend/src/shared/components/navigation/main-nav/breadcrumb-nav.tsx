'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/shared/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';

const BreadcrumbNav = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);

  // for the breadcrumb, we want to display the pathname in a readable format
  // format the breadcrumb to separate words with a space and capitalize the first letter of each word if it has a dash
  const breadcrumbItems = pathSegments.map((path) => ({
    label: path
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' '),
    path: path.toLowerCase()
  }));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/home">Home</BreadcrumbLink>
          {breadcrumbItems.length > 0 && <BreadcrumbSeparator />}
        </BreadcrumbItem>

        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem key={item.path}>
            {index === breadcrumbItems.length - 1 ? (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            ) : (
              <>
                <BreadcrumbLink
                  href={`/${pathSegments.slice(0, index + 1).join('/')}`}
                >
                  {item.label}
                </BreadcrumbLink>
                <BreadcrumbSeparator />
              </>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNav;
