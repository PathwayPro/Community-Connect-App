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
import { News, Resource } from '@/features/resources/types';
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

const filterMostReadNews = (news: News[]) => {
  // In a real app, you'd have a viewCount in the NewsItem interface
  // This is just for demonstration
  return news.filter((_, index) => index < 3);
};

const filterFeaturedNews = (news: News[]) => {
  return news.filter((item) => item.type === 'FEATURED_POST');
};

const filterResources = (resources: Resource[], type: string) => {
  return resources.filter((item) => item.type === type);
};

export const NewsList = () => {
  const router = useRouter();
  const { news, fetchNews } = useNewsStore();
  const { resources, fetchResources } = useResourcesStore();
  const { opportunities, fetchOpportunities } = useOpportunityStore();

  useEffect(() => {
    fetchNews();
    fetchResources();
    fetchOpportunities();
  }, [fetchNews, fetchResources, fetchOpportunities]);

  console.log('news store', news);

  // const canManageResources = user?.role === 'ADMIN' || user?.role === 'MENTOR';

  const [activeTab, setActiveTab] = useState('news');
  const [newsSubTab, setNewsSubTab] = useState('recent');
  const [selectedJob, setSelectedJob] = useState<OpportunityResponseDto | null>(
    null
  );
  const [selectedResourceType, setSelectedResourceType] =
    useState<string>('ALL');

  console.log(activeTab);

  // Filter news items by category
  const newsItems = news;
  const resourceItems = resources;
  const opportunityItems = opportunities;

  // Filter news based on sub-tabs
  const recentNews = filterRecentNews(newsItems);
  const editorsPickNews = filterEditorsPickNews(newsItems);
  const mostReadNews = filterMostReadNews(newsItems);
  const featuredNews = filterFeaturedNews(newsItems);

  console.log('featuredNews', featuredNews);

  // Add pagination state
  const [newsPage, setNewsPage] = useState(1);
  const [resourcePage, setResourcePage] = useState(1);
  const [opportunityPage, setOpportunityPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Pagination helper functions
  const paginateItems = <T,>(items: T[], page: number) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return items.slice(startIndex, endIndex);
  };

  // Get paginated items
  const paginatedRecentNews = paginateItems(recentNews, newsPage);
  const paginatedEditorsPickNews = paginateItems(editorsPickNews, newsPage);
  const paginatedMostReadNews = paginateItems(mostReadNews, newsPage);
  const paginatedOpportunities = paginateItems(
    opportunityItems,
    opportunityPage
  );

  // Filter and paginate resources based on selected type
  const filteredResources =
    selectedResourceType === 'ALL'
      ? resourceItems
      : filterResources(resourceItems, selectedResourceType);

  const paginatedResources = paginateItems(filteredResources, resourcePage);

  // Empty state render helpers
  const renderNewsEmptyState = () => (
    <EmptyStateCard
      icon={Newspaper}
      title="No News Available"
      description="There are no news articles available at the moment."
      action={{
        label: 'Create News Article',
        onClick: () => router.push('/resources/create?mode=news')
      }}
    />
  );

  const renderResourcesEmptyState = () => (
    <EmptyStateCard
      icon={FileText}
      title="No Resources Available"
      description="There are no resources in the content library that match your selected type."
      action={{
        label: 'Add Resource',
        onClick: () => router.push('/resources/create?mode=contentLibrary')
      }}
    />
  );

  const renderOpportunitiesEmptyState = () => (
    <EmptyStateCard
      icon={Briefcase}
      title="No Opportunities Available"
      description="There are no job opportunities available at the moment."
      action={{
        label: 'Create Opportunity',
        onClick: () => router.push('/resources/create?mode=opportunities')
      }}
    />
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
            <IconButton
              leftIcon="plusCircle"
              label={`Create ${activeTab === 'news' ? 'News' : activeTab === 'contentLibrary' ? 'Resource' : 'Opportunity'} Item`}
              className="h-12 w-fit bg-secondary-500"
              onClick={() => router.push(`/resources/create?mode=${activeTab}`)}
            />
          </div>

          {/* News Tab Content */}
          <TabsContent value="news">
            {activeTab === 'news' && (
              <div className="flex w-full gap-8">
                <div className="flex w-full flex-col gap-6">
                  <div className="relative w-full">
                    {featuredNews.length > 0 ? (
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

                        {/* Most Read */}
                        <TabsTrigger
                          value="most-read"
                          className={`h-10`}
                          onClick={() => setNewsSubTab('most-read')}
                        >
                          Most Read
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent
                      value="recent"
                      className="flex w-full flex-col gap-6"
                    >
                      {paginatedRecentNews.length > 0 ? (
                        <>
                          <div className="grid grid-cols-2 gap-6">
                            {paginatedRecentNews.map((item) => (
                              <NewsCard key={item.id} {...item} />
                            ))}
                          </div>
                          <PaginationComponent
                            currentPage={newsPage}
                            totalPages={Math.ceil(
                              recentNews.length / ITEMS_PER_PAGE
                            )}
                            onPageChange={setNewsPage}
                          />
                        </>
                      ) : (
                        renderNewsEmptyState()
                      )}
                    </TabsContent>

                    <TabsContent
                      value="editors-pick"
                      className="flex w-full flex-col gap-6"
                    >
                      <div className="grid grid-cols-2 gap-6">
                        {paginatedEditorsPickNews.map((item) => (
                          <NewsCard key={item.id} {...item} />
                        ))}
                      </div>
                      <PaginationComponent
                        currentPage={newsPage}
                        totalPages={Math.ceil(
                          editorsPickNews.length / ITEMS_PER_PAGE
                        )}
                        onPageChange={setNewsPage}
                      />
                    </TabsContent>

                    <TabsContent
                      value="most-read"
                      className="flex w-full flex-col gap-6"
                    >
                      <div className="grid grid-cols-2 gap-6">
                        {paginatedMostReadNews.map((item) => (
                          <NewsCard key={item.id} {...item} />
                        ))}
                      </div>
                      <PaginationComponent
                        currentPage={newsPage}
                        totalPages={Math.ceil(
                          mostReadNews.length / ITEMS_PER_PAGE
                        )}
                        onPageChange={setNewsPage}
                      />
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
                {paginatedResources.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      {paginatedResources.map((item) => (
                        <ResourceCard key={item.id} {...item} />
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
                ) : (
                  renderResourcesEmptyState()
                )}
              </div>
            )}
          </TabsContent>

          {/* Opportunities Tab Content */}
          <TabsContent value="opportunities">
            {activeTab === 'opportunities' && (
              <div className="flex w-full flex-col gap-6 rounded-2xl bg-white p-6">
                {selectedJob ? (
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
                    {paginatedOpportunities.length > 0 ? (
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
                    ) : (
                      renderOpportunitiesEmptyState()
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
