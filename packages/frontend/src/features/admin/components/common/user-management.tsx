'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/shared/components/ui/button';
import { DownloadIcon, Filter, X } from 'lucide-react';
import { IconInput } from '@/shared/components/ui/icon-input';
import { UsersTable } from './admin-table/user-table';
import { useAdminStore } from '../../store/admin-store';
import { useEffect } from 'react';
import { PaginationComponent } from '@/shared/components/pagination/pagination';
import { FilterModal, FilterData } from '../modals/filter-modal';
import { useUserStore } from '@/features/user-profile/store';
import { Badge } from '@/shared/components/ui/badge';
import { getFilterDisplayName, getFilterDisplayValue } from '../../lib/helper';

export const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterData>({});
  const ITEMS_PER_PAGE = 10;

  const { users, isLoading, fetchUsers } = useAdminStore();
  const { skills, fetchSkills } = useUserStore();

  useEffect(() => {
    fetchUsers({ page: currentPage, limit: ITEMS_PER_PAGE });
    fetchSkills();
  }, [fetchUsers, fetchSkills, currentPage]);

  // Apply filters to the user data
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.companyName &&
            user.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply advanced filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        filtered = filtered.filter((user) => {
          const userValue = user[key as keyof typeof user];

          if (key === 'skills' && Array.isArray(value) && value.length > 0) {
            // For skills, check if user has any of the selected skills
            return user.skills?.some((skill) =>
              value.includes(skill.toString())
            );
          }

          if (key === 'activelySearching' && typeof value === 'boolean') {
            return user[key] === value;
          }

          if (typeof value === 'string') {
            // For string filters, do case-insensitive partial matching
            return userValue
              ?.toString()
              .toLowerCase()
              .includes(value.toLowerCase());
          }

          return userValue === value;
        });
      }
    });

    return filtered;
  }, [users, searchQuery, activeFilters]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyFilters = (filters: FilterData) => {
    setActiveFilters(filters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setCurrentPage(1);
  };

  // New function to remove individual filter
  const handleRemoveFilter = (filterKey: keyof FilterData) => {
    const updatedFilters = { ...activeFilters };
    delete updatedFilters[filterKey];
    setActiveFilters(updatedFilters);
    setCurrentPage(1);
  };

  // Count active filters for badge
  const activeFilterCount = Object.values(activeFilters).filter(
    (value) =>
      value !== undefined &&
      value !== null &&
      value !== '' &&
      (!Array.isArray(value) || value.length > 0)
  ).length;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <div className="flex gap-2">
          <IconInput
            leftIcon="search"
            className="h-10 w-[250px] rounded-full bg-neutral-light-100"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Filter options */}
          <div className="flex gap-2">
            <div className="relative">
              <Button
                className="h-10 w-fit px-4"
                variant="outline"
                onClick={() => setIsFilterModalOpen(true)}
              >
                <Filter className="h-6 w-6" />
                Filter
                {activeFilterCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="h-5 w-5 rounded-full p-0 pl-1 text-xs"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
          {/* Download button */}
          <Button className="h-10 w-fit px-4">
            <DownloadIcon className="h-6 w-6" />
            Download Data
          </Button>
        </div>
      </div>

      {/* Display active filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 rounded-lg bg-gray-50 p-3">
          <span className="text-sm font-medium text-gray-700">
            Active filters:
          </span>
          {Object.entries(activeFilters).map(([key, value]) => {
            if (
              value === undefined ||
              value === null ||
              value === '' ||
              (Array.isArray(value) && value.length === 0)
            )
              return null;

            const displayName = getFilterDisplayName(key);
            const displayValue = getFilterDisplayValue(
              key,
              value,
              skills?.map((skill) => ({ ...skill, id: skill.id.toString() }))
            );

            return (
              <Badge
                key={key}
                className="flex cursor-pointer items-center gap-1 bg-secondary text-white hover:bg-secondary-600"
              >
                <span className="text-xs">
                  {displayName}: {displayValue}
                </span>
                <button
                  onClick={() => handleRemoveFilter(key as keyof FilterData)}
                  className="ml-1 rounded-full hover:bg-primary-400"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
          {activeFilterCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="ml-1 h-6 px-2 text-xs"
              onClick={handleClearFilters}
            >
              Clear All Filters
            </Button>
          )}
        </div>
      )}

      <div className="text-sm text-gray-600">
        Showing {filteredUsers.length} of {users.length} users
      </div>

      <UsersTable users={paginatedUsers} />

      <div className="flex justify-center">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        skills={skills}
        currentFilters={activeFilters}
      />
    </div>
  );
};
