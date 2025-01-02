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
  const breadcrumbItems = pathSegments.map((path) => ({
    label: path.charAt(0).toUpperCase() + path.slice(1).toLowerCase(),
    path: path.toLowerCase()
  }));

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex">
        <BreadcrumbItem className="inline-flex">
          <BreadcrumbLink href="/home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem key={item.path} className="inline-flex">
            {index === breadcrumbItems.length - 1 ? (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            ) : (
              <>
                <BreadcrumbLink
                  href={`/${pathSegments.slice(0, index + 1).join('/')}`}
                >
                  {item.label}
                </BreadcrumbLink>
                {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
              </>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNav;
