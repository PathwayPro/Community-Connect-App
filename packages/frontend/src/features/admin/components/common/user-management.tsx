'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { DownloadIcon, Filter, X } from 'lucide-react';
import { IconInput } from '@/shared/components/ui/icon-input';
import { UsersTable } from './admin-table/user-table';
import { ColumnVisibilityToggle } from './admin-table/column-visibility-toggle';
import { useAdminStore } from '../../store/admin-store';
import { PaginationComponent } from '@/shared/components/pagination/pagination';
import { FilterModal, FilterData } from '../modals/filter-modal';
import { ExportDataModal } from '../modals/export-data-modal';
import { useUserStore } from '@/features/user-profile/store';
import { Badge } from '@/shared/components/ui/badge';
import { getFilterDisplayName, getFilterDisplayValue } from '../../lib/helper';
import { VisibilityState } from '@tanstack/react-table';

// Default column visibility - all toggleable columns hidden by default
const getDefaultColumnVisibility = (): VisibilityState => ({
  city: false,
  province: false,
  companyName: false,
  experience: false,
  workStatus: false,
  lastLogin: false
});

// localStorage key for persisting column visibility
const COLUMN_VISIBILITY_STORAGE_KEY = 'admin-users-column-visibility';

export const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterData>({
    skills: []
  });

  // Column visibility state with localStorage persistence
  const [columnVisibility, setColumnVisibilityState] =
    useState<VisibilityState>(() => {
      if (typeof window === 'undefined') return getDefaultColumnVisibility();

      const saved = localStorage.getItem(COLUMN_VISIBILITY_STORAGE_KEY);
      if (saved) {
        try {
          return { ...getDefaultColumnVisibility(), ...JSON.parse(saved) };
        } catch {
          return getDefaultColumnVisibility();
        }
      }
      return getDefaultColumnVisibility();
    });

  const ITEMS_PER_PAGE = 10;

  const { users, isLoading, fetchUsers } = useAdminStore();
  const { skills, fetchSkills } = useUserStore();

  // Function to update column visibility and persist to localStorage
  const setColumnVisibility = (visibility: VisibilityState) => {
    setColumnVisibilityState(visibility);
    localStorage.setItem(
      COLUMN_VISIBILITY_STORAGE_KEY,
      JSON.stringify(visibility)
    );
  };

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
      // Skip empty or undefined values
      if (
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return; // Skip this filter
      }

      filtered = filtered.filter((user) => {
        const userValue = user[key as keyof typeof user];

        if (key === 'skills' && Array.isArray(value) && value.length > 0) {
          // For skills, check if user has any of the selected skills
          return user.skills?.some((skill) => value.includes(skill.toString()));
        }

        if (key === 'activelySearching' && typeof value === 'boolean') {
          return user[key] === value;
        }

        if (typeof value === 'string' && value.trim() !== '') {
          // For string filters, do case-insensitive partial matching
          return userValue
            ?.toString()
            .toLowerCase()
            .includes(value.toLowerCase());
        }

        return userValue === value;
      });
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
    setActiveFilters({
      skills: []
    });
    setCurrentPage(1);
  };

  // New function to remove individual filter
  const handleRemoveFilter = (filterKey: keyof FilterData) => {
    const updatedFilters = { ...activeFilters };
    if (filterKey === 'skills') {
      updatedFilters.skills = [];
    } else {
      delete updatedFilters[filterKey];
    }
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
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <IconInput
            leftIcon="search"
            className="h-10 w-full rounded-full bg-neutral-light-100 sm:w-[250px]"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Filter options */}
          <div className="flex gap-2">
            <div className="relative">
              <Button
                className="h-10 w-fit px-4"
                variant={activeFilterCount > 0 ? 'default' : 'outline'}
                onClick={() => setIsFilterModalOpen(true)}
              >
                <Filter className="mr-2 h-4 w-4" />
                {activeFilterCount > 0 ? 'Filters Applied' : 'Filter'}
                {activeFilterCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 h-5 w-5 rounded-full bg-white/20 p-0 text-xs"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
          {/* Download button */}
          <Button
            className="h-10 w-fit px-4"
            variant="outline"
            onClick={() => setIsExportModalOpen(true)}
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
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

      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row">
        <div className="text-sm text-gray-600">
          Showing {filteredUsers.length} of {users.length} users
        </div>
        <ColumnVisibilityToggle
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
        />
      </div>

      <div className="overflow-x-auto">
        <UsersTable
          users={paginatedUsers}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
        />
      </div>

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

      <ExportDataModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        users={filteredUsers}
        totalUsersCount={users.length}
      />
    </div>
  );
};
