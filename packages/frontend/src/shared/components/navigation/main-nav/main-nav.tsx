import { IconInput } from '@/shared/components/ui/icon-input';
import BreadcrumbNav from './breadcrumb-nav';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/shared/components/ui/dropdown-menu';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { SharedIcons } from '@/shared/components/icons';
import { useUserStore } from '@/features/user-profile/store/index';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { ImagePreview } from '@/shared/components/image/image-preview';

export const getImageUrl = (path: string | undefined) => {
  if (!path || path.includes('undefined')) return '/profile/profile.png';
  return `${process.env.NEXT_PUBLIC_API_URL}/files/${path}`;
};

export const MainNav = () => {
  const { user } = useUserStore();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="sticky top-0 z-30 w-full bg-white py-4">
      <div className="flex h-full items-center justify-between px-4 md:px-8">
        <BreadcrumbNav />
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <IconInput
              leftIcon="search"
              className="h-10 w-[220px] rounded-full bg-neutral-light-100 md:w-[250px]"
              placeholder="Search"
              onChange={(e) => {
                console.log(e.target.value);
              }}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <Avatar className="h-10 w-10 bg-warning-500">
                  {user?.pictureUploadLink && (
                    <ImagePreview
                      imagePath={user?.pictureUploadLink}
                      alt={user?.firstName}
                      fill={true}
                      priority={true}
                      className="rounded-full"
                    />
                  )}
                  {!user?.pictureUploadLink && (
                    <AvatarFallback className="bg-warning-500">
                      {user?.firstName
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('') || ''}
                      {user?.lastName
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('') || ''}
                    </AvatarFallback>
                  )}
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.role}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                <SharedIcons.profile className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <SharedIcons.settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <SharedIcons.logout className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
