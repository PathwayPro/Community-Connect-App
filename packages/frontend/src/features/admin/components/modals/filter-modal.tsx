/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { FormInput, FormSelect } from '@/shared/components/form';
import { FormMultiSelect } from '@/shared/components/form/form-multiselect';
import { Switch } from '@/shared/components/ui/switch';
import { Badge } from '@/shared/components/ui/badge';
import { X, Filter, RotateCcw } from 'lucide-react';
import {
  provinceData,
  ageRangeData,
  workStatusData,
  goalsOptions,
  arrivalInCanadaOptions
} from '@/features/user-profile/lib/constants/profile';
import { SkillsResponse } from '@/features/user-profile/types';

const filterSchema = z.object({
  province: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  ageRange: z.string().optional().or(z.literal('')),
  countryOfOrigin: z.string().optional().or(z.literal('')),
  languages: z.string().optional().or(z.literal('')),
  profession: z.string().optional().or(z.literal('')),
  experience: z.string().optional().or(z.literal('')),
  workStatus: z.string().optional().or(z.literal('')),
  companyName: z.string().optional().or(z.literal('')),
  skills: z.array(z.string()).optional(),
  goalId: z.string().optional().or(z.literal('')),
  arrivalInCanada: z.string().optional().or(z.literal('')),
  activelySearching: z.boolean().optional()
});

export type FilterData = z.infer<typeof filterSchema>;

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterData) => void;
  onClearFilters: () => void;
  skills: SkillsResponse[];
  currentFilters: FilterData;
}

export const FilterModal = ({
  isOpen,
  onClose,
  onApplyFilters,
  onClearFilters,
  skills,
  currentFilters
}: FilterModalProps) => {
  const [activelySearching, setActivelySearching] = useState<
    boolean | undefined
  >(currentFilters.activelySearching);

  const methods = useForm<FilterData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      ...currentFilters,
      activelySearching: currentFilters.activelySearching ?? undefined
    }
  });

  const { handleSubmit, reset, setValue, watch, formState } = methods;

  // Reset form when currentFilters change (when modal opens with existing filters)
  useEffect(() => {
    if (isOpen) {
      reset({
        ...currentFilters,
        activelySearching: currentFilters.activelySearching ?? undefined
      });
      setActivelySearching(currentFilters.activelySearching);
    }
  }, [isOpen, currentFilters, reset]);

  // Watch all form values to determine if form is dirty
  const formValues = watch();
  const hasChanges =
    Object.values(formValues).some((value) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null && value !== '';
    }) || activelySearching !== undefined;

  // Helper function to clear individual fields
  const clearField = (fieldName: keyof FilterData) => {
    if (fieldName === 'skills') {
      setValue(fieldName, [], { shouldDirty: true, shouldTouch: true });
    } else if (fieldName === 'activelySearching') {
      setValue(fieldName, undefined as any, {
        shouldDirty: true,
        shouldTouch: true
      });
      setActivelySearching(undefined);
    } else if (
      [
        'province',
        'ageRange',
        'workStatus',
        'goalId',
        'arrivalInCanada'
      ].includes(fieldName)
    ) {
      // For select fields, reset to undefined to show placeholder
      setValue(fieldName, undefined as any, {
        shouldDirty: true,
        shouldTouch: true
      });
    } else {
      // For input fields, reset to empty string to clear text
      setValue(fieldName, '' as any, { shouldDirty: true, shouldTouch: true });
    }
  };

  // Helper to check if a field has a value
  const hasFieldValue = (fieldName: keyof FilterData) => {
    const value = watch(fieldName);
    if (fieldName === 'skills') {
      return Array.isArray(value) && value.length > 0;
    }
    if (fieldName === 'activelySearching') {
      return activelySearching !== undefined;
    }
    return value !== undefined && value !== null && value !== '';
  };

  const onSubmit = (data: FilterData) => {
    // Filter out empty string values (clear selections)
    const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== '' && value !== undefined && value !== null) {
        if (Array.isArray(value) && value.length === 0) {
          return acc; // Skip empty arrays
        }
        acc[key as keyof FilterData] = value as any;
      }
      return acc;
    }, {} as Partial<FilterData>);

    const filtersWithActivelySearching = {
      ...cleanedData,
      skills: cleanedData.skills || [],
      activelySearching
    };
    onApplyFilters(filtersWithActivelySearching);
    onClose();
  };

  const handleClearFilters = () => {
    reset({
      province: undefined,
      city: '',
      ageRange: undefined,
      countryOfOrigin: '',
      languages: '',
      profession: '',
      experience: '',
      workStatus: undefined,
      companyName: '',
      skills: [],
      goalId: undefined,
      arrivalInCanada: undefined,
      activelySearching: undefined
    });
    setActivelySearching(undefined);
    onClearFilters();
  };

  const handleClose = () => {
    // Reset form to current filters when closing without applying
    reset({
      ...currentFilters,
      activelySearching: currentFilters.activelySearching ?? undefined
    });
    setActivelySearching(currentFilters.activelySearching);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Users
            {hasChanges && (
              <Badge variant="secondary" className="text-xs">
                {Object.values(formValues).filter((v) =>
                  Array.isArray(v)
                    ? v.length > 0
                    : v !== undefined && v !== null && v !== ''
                ).length + (activelySearching !== undefined ? 1 : 0)}{' '}
                active
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="rounded-lg bg-gray-50 p-3 text-gray-600">
            Filter users by location, demographics, professional background, and
            job search status. Clear individual fields with the ✕ button or
            reset all filters at once.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Location Filters */}
              <div className="relative">
                <FormSelect
                  name="province"
                  label="Province"
                  placeholder="Select province"
                  options={provinceData}
                />
                {hasFieldValue('province') && (
                  <button
                    type="button"
                    onClick={() => clearField('province')}
                    className="absolute right-2 top-9 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                    title="Clear province"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              <div className="relative">
                <FormInput name="city" label="City" placeholder="Enter city" />
                {hasFieldValue('city') && (
                  <button
                    type="button"
                    onClick={() => clearField('city')}
                    className="absolute right-2 top-9 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                    title="Clear city"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Demographics */}
              <div className="relative">
                <FormSelect
                  name="ageRange"
                  label="Age Range"
                  placeholder="Select age range"
                  options={ageRangeData}
                />
                {hasFieldValue('ageRange') && (
                  <button
                    type="button"
                    onClick={() => clearField('ageRange')}
                    className="absolute right-2 top-9 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                    title="Clear age range"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              <div className="relative">
                <FormInput
                  name="countryOfOrigin"
                  label="Country of Origin"
                  placeholder="Enter country"
                />
                {hasFieldValue('countryOfOrigin') && (
                  <button
                    type="button"
                    onClick={() => clearField('countryOfOrigin')}
                    className="absolute right-2 top-9 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                    title="Clear country of origin"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Professional Information */}
              <div className="relative">
                <FormInput
                  name="profession"
                  label="Profession"
                  placeholder="Enter profession"
                />
                {hasFieldValue('profession') && (
                  <button
                    type="button"
                    onClick={() => clearField('profession')}
                    className="absolute right-2 top-9 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                    title="Clear profession"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              <div className="relative">
                <FormInput
                  name="experience"
                  label="Years of Experience"
                  placeholder="Enter experience"
                />
                {hasFieldValue('experience') && (
                  <button
                    type="button"
                    onClick={() => clearField('experience')}
                    className="absolute right-2 top-9 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                    title="Clear experience"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              <div className="relative">
                <FormSelect
                  name="workStatus"
                  label="Work Status"
                  placeholder="Select work status"
                  options={workStatusData}
                />
                {hasFieldValue('workStatus') && (
                  <button
                    type="button"
                    onClick={() => clearField('workStatus')}
                    className="absolute right-2 top-9 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                    title="Clear work status"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              <div className="relative">
                <FormInput
                  name="companyName"
                  label="Company Name"
                  placeholder="Enter company name"
                />
                {hasFieldValue('companyName') && (
                  <button
                    type="button"
                    onClick={() => clearField('companyName')}
                    className="absolute right-2 top-9 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                    title="Clear company name"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Goals and Timeline */}
              <div className="relative">
                <FormSelect
                  name="goalId"
                  label="Goals"
                  placeholder="Select goal"
                  options={goalsOptions}
                />
                {hasFieldValue('goalId') && (
                  <button
                    type="button"
                    onClick={() => clearField('goalId')}
                    className="absolute right-2 top-9 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                    title="Clear goal"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              <div className="relative">
                <FormSelect
                  name="arrivalInCanada"
                  label="Years in Canada"
                  placeholder="Select years in Canada"
                  options={arrivalInCanadaOptions}
                />
                {hasFieldValue('arrivalInCanada') && (
                  <button
                    type="button"
                    onClick={() => clearField('arrivalInCanada')}
                    className="absolute right-2 top-9 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                    title="Clear years in Canada"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Languages */}
            <div className="relative">
              <FormInput
                name="languages"
                label="Languages"
                placeholder="Enter languages (e.g., English, French)"
              />
              {hasFieldValue('languages') && (
                <button
                  type="button"
                  onClick={() => clearField('languages')}
                  className="absolute right-2 top-9 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                  title="Clear languages"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Skills - Full width */}
            <div className="relative">
              <FormMultiSelect
                name="skills"
                label="Skills"
                options={skills.map((skill) => ({
                  label: skill.name,
                  value: skill.id
                }))}
                placeholder="Select skills"
              />
              {hasFieldValue('skills') && (
                <button
                  type="button"
                  onClick={() => clearField('skills')}
                  className="absolute right-2 top-9 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                  title="Clear selected skills"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Actively Searching Toggle */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">
                    Actively Searching for Jobs
                  </label>
                  <p className="text-xs text-gray-500">
                    Filter users by their job search status
                  </p>
                </div>
                {hasFieldValue('activelySearching') && (
                  <button
                    type="button"
                    onClick={() => clearField('activelySearching')}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                    title="Clear actively searching filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              <div className="mt-3 flex gap-2">
                <Button
                  type="button"
                  variant={
                    activelySearching === undefined ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() => setActivelySearching(undefined)}
                  className="flex-1"
                >
                  Any Status
                </Button>
                <Button
                  type="button"
                  variant={activelySearching === true ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActivelySearching(true)}
                  className="flex-1"
                >
                  Yes
                </Button>
                <Button
                  type="button"
                  variant={activelySearching === false ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActivelySearching(false)}
                  className="flex-1"
                >
                  No
                </Button>
              </div>
            </div>

            <DialogFooter className="flex flex-col gap-2 sm:flex-row">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearFilters}
                  className="h-10 flex-1 sm:flex-none"
                  disabled={!hasChanges}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  className="h-10 flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
              </div>
              <Button
                type="submit"
                className="h-10 flex-1 sm:flex-none"
                disabled={!hasChanges}
              >
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
                {hasChanges && (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-white/20 text-xs"
                  >
                    {Object.values(formValues).filter((v) =>
                      Array.isArray(v)
                        ? v.length > 0
                        : v !== undefined && v !== null && v !== ''
                    ).length + (activelySearching !== undefined ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
