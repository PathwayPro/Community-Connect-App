'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/shared/components/ui/popover';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Badge } from '@/shared/components/ui/badge';
import { Columns3, Eye, EyeOff } from 'lucide-react';
import { VisibilityState } from '@tanstack/react-table';

interface ColumnVisibilityToggleProps {
  columnVisibility: VisibilityState;
  setColumnVisibility: (visibility: VisibilityState) => void;
}

interface ToggleableColumn {
  id: string;
  label: string;
}

const TOGGLEABLE_COLUMNS: ToggleableColumn[] = [
  { id: 'city', label: 'City' },
  { id: 'province', label: 'Province' },
  { id: 'companyName', label: 'Company' },
  { id: 'experience', label: 'Experience' },
  { id: 'workStatus', label: 'Work Status' },
  { id: 'lastLogin', label: 'Last Login' }
];

const ALWAYS_VISIBLE_COLUMNS = ['name', 'email', 'role', 'status', 'actions'];

export const ColumnVisibilityToggle = ({
  columnVisibility,
  setColumnVisibility
}: ColumnVisibilityToggleProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate the number of visible columns
  const visibleColumnsCount =
    ALWAYS_VISIBLE_COLUMNS.length +
    TOGGLEABLE_COLUMNS.filter((col) => columnVisibility[col.id] !== false)
      .length;

  const toggleColumn = (columnId: string) => {
    const newVisibility = {
      ...columnVisibility,
      [columnId]: !columnVisibility[columnId]
    };
    setColumnVisibility(newVisibility);
  };

  const showAllColumns = () => {
    const newVisibility = { ...columnVisibility };
    TOGGLEABLE_COLUMNS.forEach((col) => {
      newVisibility[col.id] = true;
    });
    setColumnVisibility(newVisibility);
  };

  const hideAllToggleableColumns = () => {
    const newVisibility = { ...columnVisibility };
    TOGGLEABLE_COLUMNS.forEach((col) => {
      newVisibility[col.id] = false;
    });
    setColumnVisibility(newVisibility);
  };

  const visibleToggleableCount = TOGGLEABLE_COLUMNS.filter(
    (col) => columnVisibility[col.id] !== false
  ).length;

  const allToggleableVisible =
    visibleToggleableCount === TOGGLEABLE_COLUMNS.length;
  const someToggleableVisible = visibleToggleableCount > 0;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-10 w-fit px-4">
          <Columns3 className="mr-2 h-4 w-4" />
          Columns
          <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
            {visibleColumnsCount}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Column Visibility</h4>
            <p className="text-sm text-muted-foreground">
              Show or hide table columns. Some columns are always visible.
            </p>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={showAllColumns}
              className="h-8 px-3 text-xs"
              disabled={allToggleableVisible}
            >
              <Eye className="mr-1 h-3 w-3" />
              Show All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={hideAllToggleableColumns}
              className="h-8 px-3 text-xs"
              disabled={!someToggleableVisible}
            >
              <EyeOff className="mr-1 h-3 w-3" />
              Hide All
            </Button>
          </div>

          <div className="space-y-3">
            {/* Always visible columns */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-muted-foreground">
                Always Visible
              </h5>
              {ALWAYS_VISIBLE_COLUMNS.map((columnId) => (
                <div
                  key={columnId}
                  className="flex items-center space-x-2 opacity-50"
                >
                  <Checkbox checked={true} disabled />
                  <label className="text-sm font-medium capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {columnId === 'companyName'
                      ? 'Company'
                      : columnId === 'workStatus'
                        ? 'Work Status'
                        : columnId === 'lastLogin'
                          ? 'Last Login'
                          : columnId.charAt(0).toUpperCase() +
                            columnId.slice(1)}
                  </label>
                </div>
              ))}
            </div>

            {/* Toggleable columns */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-muted-foreground">
                Optional Columns
              </h5>
              {TOGGLEABLE_COLUMNS.map((column) => (
                <div key={column.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={column.id}
                    checked={columnVisibility[column.id] !== false}
                    onCheckedChange={() => toggleColumn(column.id)}
                  />
                  <label
                    htmlFor={column.id}
                    className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {column.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-2">
            <p className="text-xs text-muted-foreground">
              Showing {visibleColumnsCount} of{' '}
              {ALWAYS_VISIBLE_COLUMNS.length + TOGGLEABLE_COLUMNS.length}{' '}
              columns
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
