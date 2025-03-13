'use client';

import { useUserStore } from '@/features/user-profile/store';
import { MentorshipSection } from './common/mentorship-section';
import { DataTable } from './table/data-table';
import { mentorshipAdminColumns } from './table/mentoship-admin-columns';
import { mentorshipAdminData } from './table/data';
import MentorCard from './common/mentor-card';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/shared/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select';
import { useState, useMemo } from 'react';
import { PaginationComponent } from '@/shared/components/pagination/pagination';
import { bestMatchesColumns } from './table/best-matches-column';
import { IconInput } from '@/shared/components/ui/icon-input';

export const MentorshipAdminPage = () => {
  const { user } = useUserStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const ITEMS_PER_PAGE = 10;

  const filteredData = useMemo(() => {
    if (selectedStatus === 'All') return mentorshipAdminData;
    return mentorshipAdminData.filter((item) => item.status === selectedStatus);
  }, [selectedStatus]);

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

  return (
    <div className="container-wide flex w-full flex-col gap-6">
      <MentorshipSection>
        <MentorshipSection.Header>
          <h6 className="font-semibold">Hey, {user?.firstName}!👋</h6>
        </MentorshipSection.Header>
        <MentorshipSection.Content>
          <div className="flex gap-4">
            <MentorCard
              title="Mentors"
              value="1893"
              icon="minutesMentored"
              trend="arrowTrendingUp"
              trendValue="25%"
              trendText="Up from last month"
              trendUp={true}
              iconFrameClassName="bg-primary-300"
              iconClassName="stroke-white"
            />
            <MentorCard
              title="Mentees"
              value="15"
              icon="mentees"
              trend="arrowTrendingDown"
              trendValue="2.5%"
              trendText="Down from last month"
              trendUp={false}
              iconFrameClassName="bg-primary-300"
              iconClassName="stroke-white"
            />
          </div>
        </MentorshipSection.Content>
      </MentorshipSection>
      <div className="flex h-full w-full gap-4">
        <MentorshipSection className="h-[fullpx]">
          <MentorshipSection.Header>
            <div className="flex w-full items-center justify-between">
              <h6 className="font-semibold">Mentors and Mentees</h6>
              <Select
                defaultValue="All"
                onValueChange={(value) => {
                  setSelectedStatus(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </MentorshipSection.Header>
          <MentorshipSection.Content>
            <Tabs defaultValue="mentors">
              <div className="flex items-start justify-between gap-4 rounded-xl bg-neutral-light-200 p-2">
                <TabsList>
                  <TabsTrigger value="mentors" className="w-fit px-4">
                    Mentors
                  </TabsTrigger>
                  <TabsTrigger value="mentees" className="w-fit px-4">
                    Mentees
                  </TabsTrigger>
                </TabsList>
                <IconInput
                  leftIcon="search"
                  className="h-12 rounded-full bg-white"
                  placeholder="Search"
                />
              </div>
              <TabsContent value="mentors" className="mt-4">
                <DataTable
                  columns={mentorshipAdminColumns}
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
                <DataTable columns={bestMatchesColumns} data={paginatedData} />
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
    </div>
  );
};
