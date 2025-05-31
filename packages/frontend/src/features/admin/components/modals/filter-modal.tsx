/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { FormInput, FormSelect } from '@/shared/components/form';
import { FormMultiSelect } from '@/shared/components/form/form-multiselect';
import { Switch } from '@/shared/components/ui/switch';
import { X } from 'lucide-react';
import {
  provinceData,
  ageRangeData,
  workStatusData,
  goalsOptions,
  arrivalInCanadaOptions
} from '@/features/user-profile/lib/constants/profile';
import { SkillsResponse } from '@/features/user-profile/types';

const filterSchema = z.object({
  province: z.string().optional(),
  city: z.string().optional(),
  ageRange: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  languages: z.string().optional(),
  profession: z.string().optional(),
  experience: z.string().optional(),
  workStatus: z.string().optional(),
  companyName: z.string().optional(),
  skills: z.array(z.string()).optional(),
  goalId: z.string().optional(),
  arrivalInCanada: z.string().optional(),
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

  const { handleSubmit, reset, setValue, watch } = methods;

  // Helper function to clear individual fields
  const clearField = (fieldName: keyof FilterData) => {
    setValue(fieldName, undefined as any);
    if (fieldName === 'activelySearching') {
      setActivelySearching(undefined);
    }
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
      activelySearching
    };
    onApplyFilters(filtersWithActivelySearching);
    onClose();
  };

  const handleClearFilters = () => {
    reset();
    setActivelySearching(undefined);
    onClearFilters();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filter Users</DialogTitle>
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
                {watch('province') && (
                  <button
                    type="button"
                    onClick={() => clearField('province')}
                    className="absolute right-8 top-8 rounded-full p-1 hover:bg-gray-100"
                  >
                    <X className="h-3 w-3 text-gray-400" />
                  </button>
                )}
              </div>

              <div className="relative">
                <FormInput name="city" label="City" placeholder="Enter city" />
                {watch('city') && (
                  <button
                    type="button"
                    onClick={() => clearField('city')}
                    className="absolute right-3 top-8 rounded-full p-1 hover:bg-gray-100"
                  >
                    <X className="h-3 w-3 text-gray-400" />
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
                {watch('ageRange') && (
                  <button
                    type="button"
                    onClick={() => clearField('ageRange')}
                    className="absolute right-8 top-8 rounded-full p-1 hover:bg-gray-100"
                  >
                    <X className="h-3 w-3 text-gray-400" />
                  </button>
                )}
              </div>

              <div className="relative">
                <FormInput
                  name="countryOfOrigin"
                  label="Country of Origin"
                  placeholder="Enter country"
                />
                {watch('countryOfOrigin') && (
                  <button
                    type="button"
                    onClick={() => clearField('countryOfOrigin')}
                    className="absolute right-3 top-8 rounded-full p-1 hover:bg-gray-100"
                  >
                    <X className="h-3 w-3 text-gray-400" />
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
                {watch('profession') && (
                  <button
                    type="button"
                    onClick={() => clearField('profession')}
                    className="absolute right-3 top-8 rounded-full p-1 hover:bg-gray-100"
                  >
                    <X className="h-3 w-3 text-gray-400" />
                  </button>
                )}
              </div>

              <div className="relative">
                <FormInput
                  name="experience"
                  label="Years of Experience"
                  placeholder="Enter experience"
                />
                {watch('experience') && (
                  <button
                    type="button"
                    onClick={() => clearField('experience')}
                    className="absolute right-3 top-8 rounded-full p-1 hover:bg-gray-100"
                  >
                    <X className="h-3 w-3 text-gray-400" />
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
                {watch('workStatus') && (
                  <button
                    type="button"
                    onClick={() => clearField('workStatus')}
                    className="absolute right-8 top-8 rounded-full p-1 hover:bg-gray-100"
                  >
                    <X className="h-3 w-3 text-gray-400" />
                  </button>
                )}
              </div>

              <div className="relative">
                <FormInput
                  name="companyName"
                  label="Company Name"
                  placeholder="Enter company name"
                />
                {watch('companyName') && (
                  <button
                    type="button"
                    onClick={() => clearField('companyName')}
                    className="absolute right-3 top-8 rounded-full p-1 hover:bg-gray-100"
                  >
                    <X className="h-3 w-3 text-gray-400" />
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
                {watch('goalId') && (
                  <button
                    type="button"
                    onClick={() => clearField('goalId')}
                    className="absolute right-8 top-8 rounded-full p-1 hover:bg-gray-100"
                  >
                    <X className="h-3 w-3 text-gray-400" />
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
                {watch('arrivalInCanada') && (
                  <button
                    type="button"
                    onClick={() => clearField('arrivalInCanada')}
                    className="absolute right-8 top-8 rounded-full p-1 hover:bg-gray-100"
                  >
                    <X className="h-3 w-3 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Languages */}
            <div className="relative">
              <FormInput
                name="languages"
                label="Languages"
                placeholder="Enter languages"
              />
              {watch('languages') && (
                <button
                  type="button"
                  onClick={() => clearField('languages')}
                  className="absolute right-3 top-8 rounded-full p-1 hover:bg-gray-100"
                >
                  <X className="h-3 w-3 text-gray-400" />
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
              {(watch('skills')?.length ?? 0) > 0 && (
                <button
                  type="button"
                  onClick={() => clearField('skills')}
                  className="absolute right-3 top-8 rounded-full p-1 hover:bg-gray-100"
                >
                  <X className="h-3 w-3 text-gray-400" />
                </button>
              )}
            </div>

            {/* Actively Searching Toggle */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <label className="text-sm font-medium">
                  Actively Searching
                </label>
                <p className="text-xs text-gray-500">
                  Filter users by job search status
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Any</span>
                <Switch
                  checked={activelySearching === true}
                  onCheckedChange={(checked) => {
                    if (activelySearching === true) {
                      setActivelySearching(checked ? false : undefined);
                    } else if (activelySearching === false) {
                      setActivelySearching(undefined);
                    } else {
                      setActivelySearching(true);
                    }
                  }}
                />
                <span className="text-sm">Yes</span>
                {activelySearching !== undefined && (
                  <button
                    type="button"
                    onClick={() => clearField('activelySearching')}
                    className="ml-2 rounded-full p-1 hover:bg-gray-100"
                  >
                    <X className="h-3 w-3 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClearFilters}
                className="h-10"
              >
                Clear All
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="h-10"
              >
                Cancel
              </Button>
              <Button type="submit" className="h-10">
                Apply Filters
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
