'use client';

import { IconButton } from '@/shared/components/ui/icon-button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/shared/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { NewsCard } from './common/news-card';
import { useState } from 'react';
import { JobCard } from './common/job-card';
import { FeaturedNewsCard } from './common/featured-news-card';
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem
} from '@/shared/components/ui/select';
import { resourceTypes } from '../lib/constants/enums';
import { ExpandedJobCard } from './common/expanded-job-card';
import { News } from '@/features/resources/types';
import { useNewsStore } from '../store/news.store';
import { useEffect } from 'react';
import { useResourcesStore } from '../store/resources.store';
import { ResourceCard } from './common/resource-card';
import { useOpportunityStore } from '../store/opportunity.store';
import { OpportunityResponseDto } from '../dto/opportunity-dto';
import { PaginationComponent } from '@/shared/components/pagination/pagination';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/shared/components/ui/carousel';
import { EmptyStateCard } from '@/shared/components/empty-state/empty-state-card';
import { Newspaper, FileText, Briefcase } from 'lucide-react';
import { useRole } from '@/features/user-profile/hooks/useRole';
import { useUserStore } from '@/features/user-profile/store';

// Add these filter functions before the NewsList component
const filterRecentNews = (news: News[]) => {
  return [...news].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

const filterEditorsPickNews = (news: News[]) => {
  return news.filter((item) => item.type === 'EDITORS_PICK');
};

const filterFeaturedNews = (news: News[]) => {
  return news.filter((item) => item.type === 'FEATURED_POST');
};

export const NewsList = () => {
  const router = useRouter();
  const { news, fetchNews, isLoading: isNewsLoading } = useNewsStore();
  const {
    resources,
    fetchResources,
    isLoading: isResourcesLoading
  } = useResourcesStore();

  const {
    opportunities,
    fetchOpportunities,
    isLoading: isOpportunitiesLoading
  } = useOpportunityStore();

  const { hasPermission } = useRole();
  const { isLoading: isUserLoading } = useUserStore();

  // Don't render permission-dependent UI until user data is loaded
  const canCreateNews = !isUserLoading && hasPermission('create:news');
  const canCreateResource = !isUserLoading && hasPermission('create:resource');
  const canCreateOpportunity =
    !isUserLoading && hasPermission('create:opportunity');

  useEffect(() => {
    fetchNews();
    fetchResources();
    fetchOpportunities();
  }, [fetchNews, fetchResources, fetchOpportunities]);

  const [activeTab, setActiveTab] = useState('news');
  const [newsSubTab, setNewsSubTab] = useState('recent');
  const [selectedJob, setSelectedJob] = useState<OpportunityResponseDto | null>(
    null
  );
  const [selectedResourceType, setSelectedResourceType] =
    useState<string>('ALL');

  console.log('news hereeeee: ', opportunities);

  // Filter news items by category
  const newsItems = news;
  const resourceItems = resources;
  const opportunityItems = opportunities;

  // Filter news based on sub-tabs
  const recentNews = filterRecentNews(newsItems);
  const editorsPickNews = filterEditorsPickNews(newsItems);
  const featuredNews = filterFeaturedNews(newsItems);

  // Replace single newsPage with separate states for each tab
  const [recentNewsPage, setRecentNewsPage] = useState(1);
  const [editorsPickPage, setEditorsPickPage] = useState(1);
  // const [mostReadPage, setMostReadPage] = useState(1);

  // Add pagination state
  const [resourcePage, setResourcePage] = useState(1);
  const [opportunityPage, setOpportunityPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Pagination helper functions
  const paginateItems = <T,>(items: T[], page: number): T[] => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return items.slice(startIndex, endIndex);
  };

  // Get paginated items with separate pages
  const paginatedRecentNews = paginateItems(recentNews, recentNewsPage);
  const paginatedEditorsPickNews = paginateItems(
    editorsPickNews,
    editorsPickPage
  );
  // const paginatedMostReadNews = paginateItems(mostReadNews, mostReadPage);
  const paginatedOpportunities = paginateItems(
    opportunityItems,
    opportunityPage
  );

  // Filter and paginate resources based on selected type
  const filteredResources =
    selectedResourceType === 'ALL'
      ? resourceItems
      : resourceItems.filter((item) => {
          const itemType =
            typeof item.type === 'string' ? item.type : item.type[0]?.value;
          return itemType === selectedResourceType;
        });

  const paginatedResources = paginateItems(filteredResources, resourcePage);

  // Empty state render helpers
  const renderNewsEmptyState = () => (
    <EmptyStateCard
      icon={Newspaper}
      title="No News Available"
      description="There are no news articles available at the moment."
      action={
        canCreateNews
          ? {
              label: 'Create News Article',
              onClick: () => router.push('/resources/create?mode=news')
            }
          : undefined
      }
    />
  );

  const renderResourcesEmptyState = () => (
    <EmptyStateCard
      icon={FileText}
      title="No Resources Available"
      description="There are no resources in the content library that match your selected type."
      action={
        canCreateResource
          ? {
              label: 'Add Resource',
              onClick: () =>
                router.push('/resources/create?mode=contentLibrary')
            }
          : undefined
      }
    />
  );

  const renderOpportunitiesEmptyState = () => (
    <EmptyStateCard
      icon={Briefcase}
      title="No Opportunities Available"
      description="There are no job opportunities available at the moment."
      action={
        canCreateOpportunity
          ? {
              label: 'Create Opportunity',
              onClick: () => router.push('/resources/create?mode=opportunities')
            }
          : undefined
      }
    />
  );

  const renderLoadingState = () => (
    <div className="grid grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-[300px] animate-pulse rounded-lg bg-gray-100"
        />
      ))}
    </div>
  );

  return (
    <div className="container-wide w-full space-y-6">
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} defaultValue="news" className="w-full">
          <div className="mb-6 flex items-center justify-between">
            <TabsList className="h-12 w-fit">
              <TabsTrigger
                value="news"
                className={`h-10`}
                onClick={() => setActiveTab('news')}
              >
                News
              </TabsTrigger>
              <TabsTrigger
                value="contentLibrary"
                className={`h-10`}
                onClick={() => setActiveTab('contentLibrary')}
              >
                Content Library
              </TabsTrigger>
              <TabsTrigger
                value="opportunities"
                className={`h-10`}
                onClick={() => setActiveTab('opportunities')}
              >
                Opportunities
              </TabsTrigger>
            </TabsList>

            {((activeTab === 'news' && canCreateNews) ||
              (activeTab === 'contentLibrary' && canCreateResource) ||
              (activeTab === 'opportunities' && canCreateOpportunity)) && (
              <IconButton
                leftIcon="plusCircle"
                label={`Create ${activeTab === 'news' ? 'News' : activeTab === 'contentLibrary' ? 'Resource' : 'Opportunity'} Item`}
                className="h-12 w-fit bg-secondary-500"
                onClick={() =>
                  router.push(`/resources/create?mode=${activeTab}`)
                }
              />
            )}
          </div>

          {/* News Tab Content */}
          <TabsContent value="news">
            {activeTab === 'news' && (
              <div className="flex w-full gap-8">
                <div className="flex w-full flex-col gap-6">
                  <div className="relative w-full">
                    {isNewsLoading ? (
                      <div className="h-[400px] w-full animate-pulse rounded-lg bg-gray-100" />
                    ) : featuredNews.length > 0 ? (
                      <Carousel
                        opts={{
                          align: 'start',
                          loop: true
                        }}
                        className="w-full"
                      >
                        <CarouselContent>
                          {featuredNews.map((news) => (
                            <CarouselItem key={news.id}>
                              <FeaturedNewsCard {...news} />
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2" />
                      </Carousel>
                    ) : null}
                  </div>

                  <Tabs
                    defaultValue="recent"
                    className="w-full rounded-3xl bg-white p-6"
                  >
                    <div className="flex justify-between">
                      <h3 className="font-semibold">
                        {newsSubTab === 'recent'
                          ? 'Recent News'
                          : newsSubTab === 'editors-pick'
                            ? "Editor's Pick"
                            : 'Most Read'}
                      </h3>
                      <TabsList className="mb-6">
                        {/* Recent News */}
                        <TabsTrigger
                          value="recent"
                          className={`h-10`}
                          onClick={() => setNewsSubTab('recent')}
                        >
                          Recent News
                        </TabsTrigger>

                        {/* Editor's Pick */}
                        <TabsTrigger
                          value="editors-pick"
                          className={`h-10`}
                          onClick={() => setNewsSubTab('editors-pick')}
                        >
                          Editor&apos;s Pick
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent
                      value="recent"
                      className="flex w-full flex-col gap-6"
                    >
                      {isNewsLoading ? (
                        renderLoadingState()
                      ) : paginatedRecentNews.length === 0 && !isNewsLoading ? (
                        renderNewsEmptyState()
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-6">
                            {paginatedRecentNews.map((item) => (
                              <NewsCard key={item.id} {...item} />
                            ))}
                          </div>
                          <PaginationComponent
                            currentPage={recentNewsPage}
                            totalPages={Math.ceil(
                              recentNews.length / ITEMS_PER_PAGE
                            )}
                            onPageChange={setRecentNewsPage}
                          />
                        </>
                      )}
                    </TabsContent>

                    <TabsContent
                      value="editors-pick"
                      className="flex w-full flex-col gap-6"
                    >
                      {isNewsLoading ? (
                        renderLoadingState()
                      ) : paginatedEditorsPickNews.length === 0 &&
                        !isNewsLoading ? (
                        renderNewsEmptyState()
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-6">
                            {paginatedEditorsPickNews.map((item) => (
                              <NewsCard key={item.id} {...item} />
                            ))}
                          </div>
                          <PaginationComponent
                            currentPage={editorsPickPage}
                            totalPages={Math.ceil(
                              editorsPickNews.length / ITEMS_PER_PAGE
                            )}
                            onPageChange={setEditorsPickPage}
                          />
                        </>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Content Library Tab Content */}
          <TabsContent value="contentLibrary">
            {activeTab === 'contentLibrary' && (
              <div className="flex w-full flex-col gap-6 rounded-2xl bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2>Templates and Files</h2>
                  {resourceItems.length > 0 && (
                    <div className="flex w-fit">
                      <Select
                        value={selectedResourceType}
                        onValueChange={setSelectedResourceType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All Resources</SelectItem>
                          {resourceTypes.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                {isResourcesLoading ? (
                  renderLoadingState()
                ) : paginatedResources.length === 0 && !isResourcesLoading ? (
                  renderResourcesEmptyState()
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      {paginatedResources.map((item) => (
                        <ResourceCard
                          key={item.id}
                          {...item}
                          file={item.file || ''}
                        />
                      ))}
                    </div>
                    <PaginationComponent
                      currentPage={resourcePage}
                      totalPages={Math.ceil(
                        filteredResources.length / ITEMS_PER_PAGE
                      )}
                      onPageChange={setResourcePage}
                    />
                  </>
                )}
              </div>
            )}
          </TabsContent>

          {/* Opportunities Tab Content */}
          <TabsContent value="opportunities">
            {activeTab === 'opportunities' && (
              <div className="flex w-full flex-col gap-6 rounded-2xl bg-white p-6">
                {isOpportunitiesLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-[200px] animate-pulse rounded-lg bg-gray-100"
                      />
                    ))}
                  </div>
                ) : selectedJob ? (
                  <>
                    <IconButton
                      leftIcon="chevronLeft"
                      iconClassName="h-6 w-6 text-primary"
                      label="Back"
                      className="h-10 w-fit border border-primary text-primary"
                      onClick={() => setSelectedJob(null)}
                      variant="outline"
                    />
                    <ExpandedJobCard
                      opportunity={selectedJob}
                      onApply={() => {}}
                    />
                  </>
                ) : (
                  <>
                    <h2>Job Opportunities</h2>
                    {paginatedOpportunities.length === 0 &&
                    !isOpportunitiesLoading ? (
                      renderOpportunitiesEmptyState()
                    ) : (
                      <>
                        {paginatedOpportunities.map((item) => (
                          <JobCard
                            key={item.id}
                            {...item}
                            onLearnMore={() => setSelectedJob(item)}
                          />
                        ))}
                        <PaginationComponent
                          currentPage={opportunityPage}
                          totalPages={Math.ceil(
                            opportunityItems.length / ITEMS_PER_PAGE
                          )}
                          onPageChange={setOpportunityPage}
                        />
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
