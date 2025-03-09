'use client';

import { FormInput } from '@/shared/components/form';
import { FormMultiSelect } from '@/shared/components/form/form-multiselect';
import { FormProvider, useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import {
  getProfessions,
  getSkills,
  getCountries
} from '@/features/networking/lib/mock-data.ts';

interface NetworkingFilterValues {
  search: string;
  country: string[];
  skills: string[];
  professions: string[];
}

interface NetworkingFilterProps {
  onFilterChange: (values: NetworkingFilterValues) => void;
}

export const NetworkingFilter = ({ onFilterChange }: NetworkingFilterProps) => {
  // Memoize the options to ensure consistency
  const countries = useMemo(() => getCountries(), []);
  const skills = useMemo(() => getSkills(), []);
  const professions = useMemo(() => getProfessions(), []);

  const form = useForm<NetworkingFilterValues>({
    defaultValues: {
      search: '',
      country: [],
      skills: [],
      professions: []
    }
  });

  // Watch form changes and notify parent component
  useEffect(() => {
    const subscription = form.watch((values) => {
      onFilterChange(values as NetworkingFilterValues);
    });
    return () => subscription.unsubscribe();
  }, [form, onFilterChange]);

  return (
    <FormProvider {...form}>
      <FormInput
        name="search"
        hasInputIcon
        placeholder="Search networks..."
        leftIcon="search"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <FormMultiSelect
          name="country"
          label="Country"
          options={countries}
          placeholder="Select Country"
        />

        <FormMultiSelect
          name="skills"
          label="Skills"
          options={skills}
          placeholder="Select Skills"
        />

        <FormMultiSelect
          name="professions"
          label="Professions"
          options={professions}
          placeholder="Select Profession"
        />
      </div>
    </FormProvider>
  );
};
