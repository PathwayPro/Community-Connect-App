'use client';

import { useUserStore } from '@/features/user-profile/store';
import { MentorshipSection } from './common/mentorship-section';
import { DataTable } from './table/data-table';
import { mentorshipAdminColumns } from './table/mentoship-admin-columns';
// import { mentorshipAdminData } from './table/data';
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
import { useState, useMemo, useEffect } from 'react';
import { PaginationComponent } from '@/shared/components/pagination/pagination';
import { bestMatchesColumns } from './table/best-matches-column';
import { IconInput } from '@/shared/components/ui/icon-input';
import { useMentorshipStore } from '../store';
import { menteesColumns } from './table/mentees-column';

export const MentorshipAdminPage = () => {
  const { user } = useUserStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const ITEMS_PER_PAGE = 10;
  const {
    adminMentorshipTotals,
    getAdminMentorshipTotals,
    adminMentorApplications,
    getAdminMentorApplications,
    adminMenteeApplications,
    getAdminMenteeApplications
  } = useMentorshipStore();

  useEffect(() => {
    getAdminMentorshipTotals();
    getAdminMentorApplications();
    getAdminMenteeApplications();
  }, []);

  const filteredDataMentors = useMemo(() => {
    if (selectedStatus === 'All') return adminMentorApplications;
    return adminMentorApplications.filter(
      (item) => item.status === selectedStatus.toUpperCase()
    );
  }, [selectedStatus, adminMentorApplications]);

  const filteredDataMentees = useMemo(() => {
    if (selectedStatus === 'All') return adminMenteeApplications;
    return adminMenteeApplications.filter(
      (item) => item.status === selectedStatus.toUpperCase()
    );
  }, [selectedStatus, adminMenteeApplications]);

  const paginatedDataMentors = useMemo(() => {
    if (!filteredDataMentors) return [];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDataMentors.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, filteredDataMentors]);

  const paginatedDataMentees = useMemo(() => {
    if (!filteredDataMentees) return [];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDataMentees.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, filteredDataMentees]);

  const totalPagesMentors =
    filteredDataMentors && filteredDataMentors.length > 0
      ? Math.ceil(filteredDataMentors.length / ITEMS_PER_PAGE)
      : 1;

  const totalPagesMentees =
    filteredDataMentees && filteredDataMentees.length > 0
      ? Math.ceil(filteredDataMentees.length / ITEMS_PER_PAGE)
      : 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  console.log('totalPages', totalPagesMentees, totalPagesMentors);

  const mentorApplicationsTrendValue = useMemo(() => {
    const currentMonth =
      adminMentorshipTotals?.mentorApplicationsCurrentMonth > 0
        ? adminMentorshipTotals?.mentorApplicationsCurrentMonth
        : 1;
    const lastMonth =
      adminMentorshipTotals?.mentorApplicationsLastMonth > 0
        ? adminMentorshipTotals?.mentorApplicationsLastMonth
        : 1;

    if (currentMonth > lastMonth) {
      return `${((currentMonth / lastMonth) * 100).toFixed(2)}%`;
    }
    return `${((lastMonth / currentMonth) * 100).toFixed(2)}%`;
  }, [adminMentorshipTotals]);

  const menteeApplicationsTrendValue = useMemo(() => {
    const currentMonth =
      adminMentorshipTotals?.menteeApplicationsCurrentMonth > 0
        ? adminMentorshipTotals?.menteeApplicationsCurrentMonth
        : 1;
    const lastMonth =
      adminMentorshipTotals?.menteeApplicationsLastMonth > 0
        ? adminMentorshipTotals?.menteeApplicationsLastMonth
        : 1;

    if (currentMonth > lastMonth) {
      return `${((currentMonth / lastMonth) * 100).toFixed(2)}%`;
    }
    return `${((lastMonth / currentMonth) * 100).toFixed(2)}%`;
  }, [adminMentorshipTotals]);

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
              value={adminMentorshipTotals?.totalMentors.toString() || '0'}
              icon="minutesMentored"
              trend={
                adminMentorshipTotals?.mentorApplicationsCurrentMonth >
                adminMentorshipTotals?.mentorApplicationsLastMonth
                  ? 'arrowTrendingUp'
                  : 'arrowTrendingDown'
              }
              trendValue={mentorApplicationsTrendValue}
              trendText={
                adminMentorshipTotals?.mentorApplicationsCurrentMonth >
                adminMentorshipTotals?.mentorApplicationsLastMonth
                  ? 'Up applications from last month'
                  : 'Down applications from last month'
              }
              trendUp={
                adminMentorshipTotals?.mentorApplicationsCurrentMonth >
                adminMentorshipTotals?.mentorApplicationsLastMonth
              }
              iconFrameClassName="bg-primary-300"
              iconClassName="stroke-white"
            />
            <MentorCard
              title="Mentees"
              value={adminMentorshipTotals?.totalMentees.toString() || '0'}
              icon="mentees"
              trend={
                adminMentorshipTotals?.menteeApplicationsCurrentMonth >
                adminMentorshipTotals?.menteeApplicationsLastMonth
                  ? 'arrowTrendingUp'
                  : 'arrowTrendingDown'
              }
              trendValue={menteeApplicationsTrendValue}
              trendText={
                adminMentorshipTotals?.menteeApplicationsCurrentMonth >
                adminMentorshipTotals?.menteeApplicationsLastMonth
                  ? 'Up applications from last month'
                  : 'Down applications from last month'
              }
              trendUp={
                adminMentorshipTotals?.menteeApplicationsCurrentMonth >
                adminMentorshipTotals?.menteeApplicationsLastMonth
              }
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
                  data={paginatedDataMentors}
                />
                {totalPagesMentors > 1 && (
                  <div className="mt-4 flex justify-center">
                    <PaginationComponent
                      currentPage={currentPage}
                      totalPages={totalPagesMentors}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </TabsContent>
              <TabsContent value="mentees" className="mt-4">
                <DataTable
                  columns={menteesColumns}
                  data={paginatedDataMentees}
                />
                {totalPagesMentees > 1 && (
                  <div className="mt-4 flex justify-center">
                    <PaginationComponent
                      currentPage={currentPage}
                      totalPages={totalPagesMentees}
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
