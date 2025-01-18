'use client';

import { useAuthContext } from '@/features/auth/providers/auth-context';
import { Card } from '@/shared/components/ui/card';
import { IconButton } from '@/shared/components/ui/icon-button';
import { Separator } from '@/shared/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
              className="paragraph-lg hover:text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.value}
            </Link>
          ) : (
            <span className="paragraph-lg">{item.value}</span>
          )}
        </div>
      ))}
    </div>
  </div>
);

export const ViewProfile = () => {
  const router = useRouter();
  const { user } = useAuthContext();

  // view profile data builder
  const profileData = {
    name: `${user?.firstName} ${user?.lastName}`,
    avatar: user?.pictureUploadLink || '/profile/profile.png',
    stats: {
      menteesTutored: 24,
      groupSessions: 15,
      personalSessions: 42
    },
    bio: {
      label: 'Bio',
      value: user?.bio || 'Not specified'
    },
    personalInfo: [
      { label: 'Name', value: `${user?.firstName} ${user?.lastName}` },
      {
        label: 'Date of Birth',
        value: user?.dob
          ? new Date(user.dob).toLocaleDateString()
          : 'Not specified'
      },
      {
        label: 'Years in Canada',
        value: `${user?.arrivalInCanada || 0} years`
      },
      { label: 'Languages', value: user?.languages || 'Not specified' }
    ],
    contactDetails: [
      { label: 'Email', value: user?.email || 'Not specified' },
      { label: 'Province/State', value: user?.province || 'Not specified' },
      { label: 'City', value: user?.city || 'Not specified' }
    ],
    professionalInfo: [
      { label: 'Profession', value: user?.profession || 'Not specified' },
      { label: 'Experience', value: `${user?.experience || 0} years` }
    ],
    links: [
      ...(user?.linkedinLink
        ? [{ label: 'LinkedIn', value: user.linkedinLink, isLink: true }]
        : []),
      ...(user?.githubLink
        ? [{ label: 'GitHub', value: user.githubLink, isLink: true }]
        : []),
      ...(user?.twitterLink
        ? [{ label: 'Twitter', value: user.twitterLink, isLink: true }]
        : []),
      ...(user?.portfolioLink
        ? [{ label: 'Portfolio', value: user.portfolioLink, isLink: true }]
        : []),
      ...(user?.otherLinks
        ? [{ label: 'Other Links', value: user.otherLinks, isLink: true }]
        : []),
      ...(user?.additionalLinks?.map((link) => ({
        label: 'Additional Link',
        value: link,
        isLink: true
      })) || [])
    ].filter((link) => link.value) // Remove empty links
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <Card className="space-y-8 p-6">
        {/* Edit Profile Button */}
        <div className="flex justify-end">
          <IconButton
            leftIcon="pencilSquare"
            label="Edit Profile"
            className="w-[180px]"
            onClick={() => router.push('/profile/update')}
          />
        </div>

        {/* Avatar Card */}
        {/* <Card className="space-y-6 p-6"> */}
        {/* Avatar and Name Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative h-40 w-40 overflow-hidden rounded-full bg-warning-500">
            <Image
              src={profileData.avatar}
              alt="Profile-avatar"
              width={160}
              height={160}
              priority
              className="h-full w-full object-cover"
            />
          </div>
          <h3 className="font-bold">{profileData.name}</h3>
        </div>

        {/* Stats Section */}
        <div className="flex items-center justify-center gap-8">
          <StatItem
            label="Mentees Tutored"
            value={profileData.stats.menteesTutored}
          />
          <Separator orientation="vertical" className="h-12" />
          <StatItem
            label="Group Sessions"
            value={profileData.stats.groupSessions}
          />
          <Separator orientation="vertical" className="h-12" />
          <StatItem
            label="Personal Sessions"
            value={profileData.stats.personalSessions}
          />
        </div>

        {/* Bio */}
        {profileData.bio && (
          <>
            <div className="space-y-3">
              <Separator />
              <p className="paragraph-lg text-center text-muted-foreground">
                {profileData.bio.value}
              </p>
            </div>
          </>
        )}
        {/* </Card> */}

        {/* Information Cards */}
        <div className="space-y-6">
          {/* Personal Information */}
          {profileData.personalInfo.length > 0 && (
            <Card className="bg-neutral-light-200 p-6">
              <InfoGroup
                title="Personal Information"
                items={profileData.personalInfo}
              />
            </Card>
          )}

          {/* Contact Details */}
          {profileData.contactDetails.length > 0 && (
            <Card className="bg-neutral-light-200 p-6">
              <InfoGroup
                title="Contact Details"
                items={profileData.contactDetails}
              />
            </Card>
          )}

          {/* Professional Information */}
          {profileData.professionalInfo.length > 0 && (
            <Card className="bg-neutral-light-200 p-6">
              <InfoGroup
                title="Professional Information"
                items={profileData.professionalInfo}
              />
            </Card>
          )}

          {/* Links */}
          {profileData.links.length > 0 && (
            <Card className="bg-neutral-light-200 p-6">
              <InfoGroup title="Links" items={profileData.links} />
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
