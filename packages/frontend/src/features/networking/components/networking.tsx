'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/shared/components/ui/tabs';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/card';
import { NetworkingFilter } from './networking-filter';
import { NetworkingCard } from './networking-card';
import { PaginationComponent } from '@/shared/components/pagination/pagination';
import { EmptyStateCard } from '@/shared/components/empty-state/empty-state-card';
import { SearchIcon } from 'lucide-react';
import { useNetworkingStore } from '../store';

interface FilterValues {
  search: string;
  country: string[];
  skills: string[];
  professions: string[];
}

export const Networking = () => {
  const [activeTab, setActiveTab] = useState<string>('network');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Filtering
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    country: [],
    skills: [],
    professions: []
  });

  // get users
  const {
    connections,
    connectionRequests,
    getConnections,
    getConnectionRequests,
    isLoading
  } = useNetworkingStore();

  useEffect(() => {
    getConnections();
    getConnectionRequests();
  }, [getConnections, getConnectionRequests]);

  console.log(
    'connec tionnnnnss :',
    connections,
    'connection requests :',
    connectionRequests
  );

  const filteredData = useMemo(() => {
    return connectionRequests.filter((request) => {
      // Filter by tab
      if (activeTab === 'mentor' && request.role !== 'MENTOR') {
        return false;
      }

      if (
        activeTab === 'connection' &&
        request.connectionStatus.status !== 'APPROVED'
      ) {
        return false;
      }

      // Filter by search term
      if (
        filters.search &&
        !request.first_name.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Filter by country
      if (
        filters.country.length > 0 &&
        !filters.country.includes(request.country_of_origin ?? '')
      ) {
        return false;
      }

      // Filter by skills
      if (
        filters.skills.length > 0 &&
        !filters.skills.some((skill) => request.skills?.includes(skill))
      ) {
        return false;
      }

      // Filter by profession
      if (
        filters.professions.length > 0 &&
        !filters.professions.includes(request.profession ?? '')
      ) {
        return false;
      }

      return true;
    });
  }, [filters, connectionRequests, activeTab]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  console.log('filteredData', filteredData);

  // Loading
  if (isLoading) {
    return (
      <div className="container h-full w-full space-y-4 px-4 md:px-0">
        <Card>
          <CardHeader className="flex animate-pulse flex-col items-start justify-between gap-3 space-y-0 pb-4 md:flex-row md:items-center">
            <div className="h-8 w-32 rounded-md bg-muted" />
            <div className="h-10 w-64 rounded-md bg-muted" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="h-10 w-full rounded-md bg-muted" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                <div className="h-10 rounded-md bg-muted" />
                <div className="h-10 rounded-md bg-muted" />
                <div className="h-10 rounded-md bg-muted" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="mt-6">
          <CardContent>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="flex h-[300px] animate-pulse flex-col space-y-3 rounded-lg bg-muted p-4"
                >
                  <div className="h-24 w-24 rounded-full bg-muted-foreground/20" />
                  <div className="h-4 w-3/4 rounded bg-muted-foreground/20" />
                  <div className="h-4 w-1/2 rounded bg-muted-foreground/20" />
                  <div className="mt-auto space-y-2">
                    <div className="h-4 w-full rounded bg-muted-foreground/20" />
                    <div className="h-4 w-full rounded bg-muted-foreground/20" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container h-full w-full space-y-4 px-4 md:px-0">
      <Tabs defaultValue="network" onValueChange={setActiveTab}>
        <Card>
          <CardHeader className="flex flex-col items-start justify-between gap-3 space-y-0 pb-4 md:flex-row md:items-center">
            <CardTitle>
              <h4 className="font-semibold">Search Networks</h4>
            </CardTitle>
            <TabsList className="flex w-full max-w-full gap-2 overflow-x-auto md:grid md:grid-cols-3 md:gap-0">
              <TabsTrigger value="network">Network</TabsTrigger>
              <TabsTrigger value="mentor">Mentors</TabsTrigger>
              <TabsTrigger value="connection">Connections</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="space-y-6">
            <NetworkingFilter onFilterChange={setFilters} />
          </CardContent>
        </Card>
        <Card className="mt-6">
          <CardContent>
            <TabsContent value={activeTab} className="mt-6">
              <div className="mt-4 space-y-4">
                {filteredData.length === 0 ? (
                  <EmptyStateCard
                    title="No results found"
                    description="We couldn't find any results for your search. Please try again."
                    icon={SearchIcon}
                  />
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {paginatedData.map((request) => (
                        <NetworkingCard key={request.id} profile={request} />
                      ))}
                    </div>
                    {totalPages > 1 && (
                      <div className="mt-8 flex justify-center">
                        <PaginationComponent
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};
