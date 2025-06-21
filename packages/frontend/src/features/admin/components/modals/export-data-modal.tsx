'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { Download, FileSpreadsheet, FileText, Eye, EyeOff } from 'lucide-react';
import { AdminUser } from '../../types';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { toast } from 'sonner';

interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: AdminUser[];
  totalUsersCount: number;
}

interface ExportableColumn {
  id: string;
  label: string;
  mandatory?: boolean;
}

const EXPORTABLE_COLUMNS: ExportableColumn[] = [
  { id: 'name', label: 'Name', mandatory: true },
  { id: 'email', label: 'Email', mandatory: true },
  { id: 'role', label: 'Role' },
  { id: 'status', label: 'Status' },
  { id: 'city', label: 'City' },
  { id: 'province', label: 'Province' },
  { id: 'companyName', label: 'Company' },
  { id: 'experience', label: 'Experience' },
  { id: 'workStatus', label: 'Work Status' },
  { id: 'profession', label: 'Profession' },
  { id: 'countryOfOrigin', label: 'Country of Origin' },
  { id: 'arrivalInCanada', label: 'Arrival in Canada' },
  { id: 'languages', label: 'Languages' },
  { id: 'bio', label: 'Bio' },
  { id: 'activelySearching', label: 'Actively Searching' },
  { id: 'lastLogin', label: 'Last Login' }
];

export type ExportFormat = 'csv' | 'xlsx';

export const ExportDataModal = ({
  isOpen,
  onClose,
  users,
  totalUsersCount
}: ExportDataModalProps) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(() => {
    // Default to mandatory columns plus a few commonly used ones
    return ['name', 'email', 'role', 'status', 'city', 'province'];
  });
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');
  const [isExporting, setIsExporting] = useState(false);

  const toggleColumn = (columnId: string) => {
    const column = EXPORTABLE_COLUMNS.find((col) => col.id === columnId);
    if (column?.mandatory) return; // Can't toggle mandatory columns

    setSelectedColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };

  const selectAllColumns = () => {
    setSelectedColumns(EXPORTABLE_COLUMNS.map((col) => col.id));
  };

  const selectOnlyMandatory = () => {
    setSelectedColumns(
      EXPORTABLE_COLUMNS.filter((col) => col.mandatory).map((col) => col.id)
    );
  };

  const formatUserData = (user: AdminUser): Record<string, string | number> => {
    const data: Record<string, string | number> = {};

    selectedColumns.forEach((columnId) => {
      switch (columnId) {
        case 'name':
          data['Name'] = `${user.firstName} ${user.lastName}`;
          break;
        case 'email':
          data['Email'] = user.email;
          break;
        case 'role':
          data['Role'] = user.role;
          break;
        case 'status':
          data['Status'] = user.status || 'N/A';
          break;
        case 'city':
          data['City'] = user.city || 'N/A';
          break;
        case 'province':
          data['Province'] = user.province || 'N/A';
          break;
        case 'companyName':
          data['Company'] = user.companyName || 'N/A';
          break;
        case 'experience':
          data['Experience'] = user.experience || 'N/A';
          break;
        case 'workStatus':
          data['Work Status'] = user.workStatus || 'N/A';
          break;
        case 'profession':
          data['Profession'] = user.profession || 'N/A';
          break;
        case 'countryOfOrigin':
          data['Country of Origin'] = user.countryOfOrigin || 'N/A';
          break;
        case 'arrivalInCanada':
          data['Arrival in Canada'] = user.arrivalInCanada || 'N/A';
          break;
        case 'languages':
          data['Languages'] = Array.isArray(user.languages)
            ? user.languages.join(', ')
            : user.languages || 'N/A';
          break;
        case 'bio':
          data['Bio'] = user.bio || 'N/A';
          break;
        case 'activelySearching':
          data['Actively Searching'] = user.activelySearching ? 'Yes' : 'No';
          break;
        case 'lastLogin':
          data['Last Login'] = user.lastLogin
            ? new Date(user.lastLogin).toLocaleString()
            : 'Never';
          break;
      }
    });

    return data;
  };

  const generateCSV = (data: Record<string, string | number>[]) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `users-export-${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateXLSX = (data: Record<string, string | number>[]) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

    // Auto-size columns
    const columnWidths = Object.keys(data[0] || {}).map((key) => ({
      wch: Math.max(
        key.length,
        ...data.map((row) => String(row[key] || '').length)
      )
    }));
    worksheet['!cols'] = columnWidths;

    XLSX.writeFile(
      workbook,
      `users-export-${new Date().toISOString().split('T')[0]}.xlsx`
    );
  };

  const handleExport = async () => {
    if (selectedColumns.length === 0) {
      toast.error('Please select at least one column to export');
      return;
    }

    setIsExporting(true);
    try {
      const exportData = users.map(formatUserData);

      if (exportFormat === 'csv') {
        generateCSV(exportData);
      } else {
        generateXLSX(exportData);
      }

      toast.success(
        `Successfully exported ${users.length} users to ${exportFormat.toUpperCase()}`
      );
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const mandatoryColumns = EXPORTABLE_COLUMNS.filter((col) => col.mandatory);
  const optionalColumns = EXPORTABLE_COLUMNS.filter((col) => !col.mandatory);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export User Data
          </DialogTitle>
          <DialogDescription className="sr-only">
            Export user data to a CSV or Excel file.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Summary */}
          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="mb-2 font-medium">Export Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Users to export:</span>
                <span className="ml-2 font-medium">{users.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Total users:</span>
                <span className="ml-2 font-medium">{totalUsersCount}</span>
              </div>
              <div>
                <span className="text-gray-600">Selected columns:</span>
                <Badge variant="secondary" className="ml-2">
                  {selectedColumns.length}
                </Badge>
              </div>
              <div>
                <span className="text-gray-600">Format:</span>
                <span className="ml-2 font-medium uppercase">
                  {exportFormat}
                </span>
              </div>
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <h4 className="mb-3 font-medium">Export Format</h4>
            <RadioGroup
              value={exportFormat}
              onValueChange={(value) => setExportFormat(value as ExportFormat)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label
                  htmlFor="csv"
                  className="flex cursor-pointer items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  CSV
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="xlsx" id="xlsx" />
                <Label
                  htmlFor="xlsx"
                  className="flex cursor-pointer items-center gap-2"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Excel (XLSX)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Column Selection */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-medium">Select Columns to Export</h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAllColumns}
                  className="h-8 px-3 text-xs"
                >
                  <Eye className="mr-1 h-3 w-3" />
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectOnlyMandatory}
                  className="h-8 px-3 text-xs"
                >
                  <EyeOff className="mr-1 h-3 w-3" />
                  Mandatory Only
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Mandatory Columns */}
              <div>
                <h5 className="mb-2 text-sm font-medium text-gray-600">
                  Mandatory Columns
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  {mandatoryColumns.map((column) => (
                    <div
                      key={column.id}
                      className="flex items-center space-x-2 opacity-75"
                    >
                      <Checkbox checked={true} disabled />
                      <label className="text-sm font-medium leading-none">
                        {column.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Columns */}
              <div>
                <h5 className="mb-2 text-sm font-medium text-gray-600">
                  Optional Columns
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  {optionalColumns.map((column) => (
                    <div
                      key={column.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={column.id}
                        checked={selectedColumns.includes(column.id)}
                        onCheckedChange={() => toggleColumn(column.id)}
                      />
                      <label
                        htmlFor={column.id}
                        className="cursor-pointer text-sm font-medium leading-none"
                      >
                        {column.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export {exportFormat.toUpperCase()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
