'use client';

import { Card, CardContent } from '@/shared/components/ui/card';
import { IconButton } from '@/shared/components/ui/icon-button';
import { Separator } from '@/shared/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../store';
import { useFetchProfile } from '../hooks/use-fetch-profile';
import { formatDate } from 'date-fns';
import {
  getArrivalInCanadaLabel,
  getSkillLabel
} from '@/features/user-profile/lib/utils';
import { useSettingsStore } from '@/features/settings/store';
import { useEffect } from 'react';

interface StatItemProps {
  label: string;
  value: number;
}

const StatItem = ({ label, value }: StatItemProps) => (
  <div className="flex flex-col items-center">
    <span className="paragraph-lg text-muted-foreground">{label}</span>
    <h5 className="paragraph-lg font-semibold">{value}</h5>
  </div>
);

interface InfoGroupProps {
  title: string;
  items: { label: string; value: string; isLink?: boolean }[];
}

const InfoGroup = ({ title, items }: InfoGroupProps) => (
  <div className="space-y-3">
    <h5 className="font-semibold text-primary">{title}</h5>
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between">
          <span className="paragraph-lg text-muted-foreground">
            {item.label}
          </span>
          {item.isLink ? (
            <Link
              href={
                item.value.startsWith('http')
                  ? item.value
                  : `https://${item.value}`
              }
              className="paragraph-lg text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.value}
            </Link>
          ) : (
            <div className="flex w-[50%] justify-end">
              <span className="paragraph-lg text-right">{item.value}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

interface ViewProfileProps {
  slug?: string;
}

export const ViewProfile = ({ slug }: ViewProfileProps) => {
  const router = useRouter();
  const { user } = useUserStore();
  const { settings, getSettingsById } = useSettingsStore();
  const { skills, fetchSkills } = useUserStore();

  const userId = slug;

  const { isLoading, error, data: profileData } = useFetchProfile(userId);

  const isOwnProfile = !userId || Number(userId) === user?.id;
  const displayedUser = isOwnProfile ? user : profileData;

  useEffect(() => {
    if (!isOwnProfile) {
      getSettingsById(Number(userId));
    }
    fetchSkills();
  }, [isOwnProfile, userId, getSettingsById, fetchSkills]);

  console.log('skills in view profile', skills);

  // view profile data builder
  const profileDataBuilder = {
    name: `${displayedUser?.firstName} ${displayedUser?.lastName}`,
    avatar: displayedUser?.pictureUploadLink || '/profile/profile.png',
    stats: {
      menteesTutored: 24,
      groupSessions: 15,
      personalSessions: 42
    },
    bio: {
      label: 'Bio',
      value: displayedUser?.bio || 'Not specified'
    },
    personalInfo: [
      {
        label: 'Name',
        value: `${displayedUser?.firstName} ${displayedUser?.lastName}`
      },
      ...(settings?.shareBirthDate
        ? [
            {
              label: 'Date of Birth',
              value: displayedUser?.dob
                ? formatDate(new Date(displayedUser.dob), 'MMMM d')
                : 'Not specified'
            }
          ]
        : []),
      {
        label: 'Years in Canada',
        value: displayedUser?.arrivalInCanada
          ? getArrivalInCanadaLabel(displayedUser.arrivalInCanada)
          : 'Not specified'
      },
      {
        label: 'Country of Origin',
        value: displayedUser?.countryOfOrigin || 'Not specified'
      },
      { label: 'Languages', value: displayedUser?.languages || 'Not specified' }
    ],
    contactDetails: [
      { label: 'Email', value: displayedUser?.email || 'Not specified' },
      {
        label: 'Province/State',
        value: displayedUser?.province || 'Not specified'
      },
      { label: 'City', value: displayedUser?.city || 'Not specified' }
    ],
    professionalInfo: [
      {
        label: 'Profession',
        value: displayedUser?.profession || 'Not specified'
      },
      {
        label: 'Company',
        value: displayedUser?.companyName || 'Not specified'
      },
      { label: 'Experience', value: `${displayedUser?.experience || 0} years` },
      {
        label: 'Skills',
        value: displayedUser?.skills
          ? displayedUser.skills
              .map((skillId: string) => getSkillLabel(skillId, skills))
              .join(', ')
          : 'Not specified'
      }
    ],
    links: [
      ...(displayedUser?.linkedinLink
        ? [
            {
              label: 'LinkedIn',
              value: displayedUser.linkedinLink,
              isLink: true
            }
          ]
        : []),
      ...(displayedUser?.githubLink
        ? [{ label: 'GitHub', value: displayedUser.githubLink, isLink: true }]
        : []),
      ...(displayedUser?.twitterLink
        ? [{ label: 'Twitter', value: displayedUser.twitterLink, isLink: true }]
        : []),
      ...(displayedUser?.portfolioLink
        ? [
            {
              label: 'Portfolio',
              value: displayedUser.portfolioLink,
              isLink: true
            }
          ]
        : []),
      ...(displayedUser?.otherLinks
        ? [
            {
              label: 'Other Links',
              value: displayedUser.otherLinks,
              isLink: true
            }
          ]
        : []),
      ...(displayedUser?.additionalLinks?.map((link: string) => ({
        label: 'Additional Link',
        value: link,
        isLink: true
      })) || [])
    ].filter((link) => link.value) // Remove empty links
  };

  if (isLoading) {
    return (
      <Card className="flex min-w-[840px] flex-col rounded-[24px]">
        <CardContent className="flex items-center justify-center p-8">
          Loading profile...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex w-[840px] flex-col rounded-[24px]">
        <CardContent className="flex items-center justify-center p-8">
          Error loading profile: {error.message}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container-default mx-auto min-w-[1024px] max-w-4xl">
      <Card className="space-y-8 p-6">
        {/* Edit Profile Button - Only show for own profile */}
        <div className="flex justify-between gap-4">
          <IconButton
            label="Back"
            leftIcon="arrowLeft"
            variant="outline"
            className="h-10 w-fit"
            onClick={() => router.back()}
          />
          {isOwnProfile && (
            <IconButton
              leftIcon="pencilSquare"
              label="Edit Profile"
              className="h-10 w-fit"
              onClick={() => router.push('/profile/update')}
            />
          )}
        </div>

        {/* Avatar Card */}
        {/* <Card className="space-y-6 p-6"> */}
        {/* Avatar and Name Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative h-40 w-40 overflow-hidden rounded-full bg-warning-500">
            <Image
              src={profileDataBuilder.avatar}
              alt="Profile-avatar"
              width={160}
              height={160}
              priority
              className="h-full w-full object-cover"
            />
          </div>
          <h3 className="font-bold">{profileDataBuilder.name}</h3>
        </div>

        {/* Stats Section */}
        <div className="flex items-center justify-center gap-8">
          <StatItem
            label="Mentees Tutored"
            value={profileDataBuilder.stats.menteesTutored}
          />
          <Separator orientation="vertical" className="h-12" />
          <StatItem
            label="Group Sessions"
            value={profileDataBuilder.stats.groupSessions}
          />
          <Separator orientation="vertical" className="h-12" />
          <StatItem
            label="Personal Sessions"
            value={profileDataBuilder.stats.personalSessions}
          />
        </div>

        {/* Bio */}
        {profileDataBuilder.bio && (
          <>
            <div className="space-y-3">
              <Separator />

              <p className="paragraph-lg pt-3 text-center text-muted-foreground">
                {profileDataBuilder.bio.value}
              </p>
            </div>
          </>
        )}
        {/* </Card> */}

        {/* Information Cards */}
        <div className="space-y-6">
          {/* Personal Information */}
          {profileDataBuilder.personalInfo.length > 0 && (
            <Card className="bg-neutral-light-200 p-6">
              <InfoGroup
                title="Personal Information"
                items={profileDataBuilder.personalInfo}
              />
            </Card>
          )}

          {/* Contact Details */}
          {profileDataBuilder.contactDetails.length > 0 &&
            settings?.shareContactDetails && (
              <Card className="bg-neutral-light-200 p-6">
                <InfoGroup
                  title="Contact Details"
                  items={profileDataBuilder.contactDetails}
                />
              </Card>
            )}

          {/* Professional Information */}
          {profileDataBuilder.professionalInfo.length > 0 && (
            <Card className="bg-neutral-light-200 p-6">
              <InfoGroup
                title="Professional Information"
                items={profileDataBuilder.professionalInfo}
              />
            </Card>
          )}

          {/* Links */}
          {profileDataBuilder.links.length > 0 &&
            settings?.shareSocialLinks && (
              <Card className="bg-neutral-light-200 p-6">
                <InfoGroup title="Links" items={profileDataBuilder.links} />
              </Card>
            )}
        </div>

        {/* View Resume Button */}
        <IconButton
          leftIcon="fileIcon"
          label="View Resume"
          className="w-full"
          onClick={() => alert('Download Resume')}
        />
      </Card>
    </div>
  );
};
