import Image from 'next/image';
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
import { useAuthContext } from '@/features/auth/providers/auth-context';
import { useRouter } from 'next/navigation';
import { SharedIcons } from '@/shared/components/icons';

export const MainNav = () => {
  const { user } = useAuthContext();
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
    <div className="sticky top-0 z-30 h-20 w-full border-b bg-white">
      <div className="flex h-full items-center justify-between px-8">
        <BreadcrumbNav />
        <div className="flex items-center gap-2">
          <IconInput
            leftIcon="search"
            className="h-10 w-[250px] rounded-full bg-neutral-light-100"
            placeholder="Search"
            onChange={(e) => {
              console.log(e.target.value);
            }}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <Image
                  src={user?.pictureUploadLink || '/profile/profile.png'}
                  alt="user profile"
                  width={48}
                  height={48}
                  className="cursor-pointer rounded-full bg-warning-500 transition-opacity hover:opacity-80"
                  priority
                />
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
