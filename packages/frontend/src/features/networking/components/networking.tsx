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
  const { networkingUsers, connections, getNetworkingUsers, isLoading } =
    useNetworkingStore();

  useEffect(() => {
    getNetworkingUsers();
  }, [getNetworkingUsers]);

  console.log(
    'users hereeeeee :',
    networkingUsers,
    'connec tionnnnnss :',
    connections
  );

  const filteredData = useMemo(() => {
    console.log('networkingProfiles in filteredData', networkingUsers);

    return networkingUsers.filter((profile) => {
      // Filter by tab
      if (activeTab === 'mentor' && profile.role !== 'MENTOR') {
        return false;
      }

      if (activeTab === 'connection' && !profile.isConnected) {
        return false;
      }

      // Filter by search term
      if (
        filters.search &&
        !profile.firstName.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Filter by country
      if (
        filters.country.length > 0 &&
        !filters.country.includes(profile?.countryOfOrigin ?? '')
      ) {
        return false;
      }

      // Filter by skills
      if (
        filters.skills.length > 0 &&
        !filters.skills.some((skill) => profile.skills?.includes(skill))
      ) {
        return false;
      }

      // Filter by profession
      if (
        filters.professions.length > 0 &&
        !filters.professions.includes(profile.profession ?? '')
      ) {
        return false;
      }

      return true;
    });
  }, [filters, networkingUsers, activeTab]);

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
    return <div>Loading...</div>;
  }

  return (
    <div className="container h-full w-full space-y-4">
      <Tabs defaultValue="network" onValueChange={setActiveTab}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>
              <h4 className="font-semibold">Search Networks</h4>
            </CardTitle>
            <TabsList className="grid grid-cols-3">
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
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                      {paginatedData.map((profile) => (
                        <NetworkingCard key={profile.id} profile={profile} />
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
