'use client';

import { FormInput } from '@/shared/components/form';
import { FormMultiSelect } from '@/shared/components/form/form-multiselect';
import { FormProvider, useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { getCountries } from '@/features/networking/lib/mock-data.ts';
import { useUserStore } from '@/features/user-profile/store';

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
  const { professions, fetchProfessions, skills, fetchSkills } = useUserStore();

  // Memoize transformed skills and professions
  const skillOptions = useMemo(
    () =>
      skills.map((skill) => ({
        value: skill.id,
        label: skill.name
      })),
    [skills]
  );

  const professionOptions = useMemo(
    () =>
      professions.map((profession) => ({
        value: profession,
        label: profession
      })),
    [professions]
  );

  useEffect(() => {
    fetchProfessions();
    fetchSkills();
  }, [fetchProfessions, fetchSkills]);

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
          options={skillOptions}
          placeholder="Select Skills"
        />

        <FormMultiSelect
          name="professions"
          label="Professions"
          options={professionOptions}
          placeholder="Select Profession"
        />
      </div>
    </FormProvider>
  );
};
