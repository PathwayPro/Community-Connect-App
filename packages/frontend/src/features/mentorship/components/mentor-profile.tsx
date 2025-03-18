'use client';

import { useSearchParams } from 'next/navigation';
import {
  mentorRatingData,
  MentorshipAdmin,
  mentorshipAdminData
} from './table/data';
import { useRouter } from 'next/navigation';
import { MentorApproval } from './common/mentor-approval';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { MentorshipSection } from './common/mentorship-section';
import { useMemo, useState } from 'react';
import { DataTable } from './table/data-table';
import { PaginationComponent } from '@/shared/components/pagination/pagination';
import { IconInput } from '@/shared/components/ui/icon-input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/shared/components/ui/tabs';
import { AssignMenteesColumns } from './table/assigned-mentees-column';
import { RegisteredSessionsColumns } from './table/registered-sessions-column';
import { bestMatchesColumns } from './table/best-matches-column';

export const MentorProfile = () => {
  const searchParams = useSearchParams();
  const rowData = searchParams.get('data');
  const mentorData: MentorshipAdmin = rowData ? JSON.parse(rowData) : null;
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filteredData = useMemo(() => {
    return mentorshipAdminData;
  }, []);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, filteredData]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  console.log('totalPages', totalPages);

  if (!mentorData) {
    return <div>No mentor data available</div>;
  }

  return (
    <div className="container-wide flex w-full flex-col gap-6">
      <Button
        variant="outline"
        className="h-10 w-fit"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <MentorApproval mentorProfile={mentorData} />

      {/* admin mentorship management table */}
      {mentorData.status === 'Approved' && (
        <div className="flex h-full w-full gap-4">
          <MentorshipSection className="h-full">
            <MentorshipSection.Content>
              <Tabs defaultValue="best-matches">
                <div className="flex items-start justify-between gap-4 rounded-xl bg-neutral-light-200 p-2">
                  <TabsList>
                    <TabsTrigger value="best-matches" className="w-fit px-4">
                      Best Matches
                    </TabsTrigger>
                    <TabsTrigger value="mentees" className="w-fit px-4">
                      Mentees Assigned
                    </TabsTrigger>
                    <TabsTrigger value="sessions" className="w-fit px-4">
                      Registered Sessions
                    </TabsTrigger>
                  </TabsList>
                  <IconInput
                    leftIcon="search"
                    className="h-12 rounded-full bg-white"
                    placeholder="Search"
                  />
                </div>
                <TabsContent value="best-matches" className="mt-4">
                  <DataTable
                    columns={bestMatchesColumns}
                    data={paginatedData}
                  />
                  {totalPages > 1 && (
                    <div className="mt-4 flex justify-center">
                      <PaginationComponent
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="mentees" className="mt-4">
                  <DataTable
                    columns={AssignMenteesColumns}
                    data={paginatedData}
                  />
                  {totalPages > 1 && (
                    <div className="mt-4 flex justify-center">
                      <PaginationComponent
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="sessions" className="mt-4">
                  <DataTable
                    columns={RegisteredSessionsColumns}
                    data={mentorRatingData}
                  />
                  {totalPages > 1 && (
                    <div className="mt-4 flex justify-center">
                      <PaginationComponent
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </MentorshipSection.Content>
          </MentorshipSection>
        </div>
      )}
    </div>
  );
};
