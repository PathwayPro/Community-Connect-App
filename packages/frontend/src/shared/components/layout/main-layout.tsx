import { MainNav } from '../navigation/main-nav';
import { Sidebar } from '../navigation/side-nav';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex w-full">
      <Sidebar isOpen={true} />
      <main className="flex-1">
        <MainNav />
        <div className="h-full justify-center bg-neutral-light-200 p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
