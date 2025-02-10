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
import { resourceTypes } from './forms';
import { ExpandedJobCard } from './common/expanded-job-card';
import {
  sampleNews,
  sampleResource,
  sampleOpportunity
} from '../lib/validation/data/mock-data';
import { NewsItem, JobCardProps } from '@/features/news/types';

// Add these filter functions before the NewsList component
const filterRecentNews = (news: NewsItem[]) => {
  return [...news].sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  );
};

const filterEditorsPickNews = (news: NewsItem[]) => {
  // In a real app, you'd have an editorsPick flag in the NewsItem interface
  // This is just for demonstration
  return news.filter((_, index) => index < 2);
};

const filterMostReadNews = (news: NewsItem[]) => {
  // In a real app, you'd have a viewCount in the NewsItem interface
  // This is just for demonstration
  return news.filter((_, index) => index < 3);
};

export const NewsList = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('news');
  const [newsSubTab, setNewsSubTab] = useState('recent');
  // const [resourceType, setResourceType] = useState('resume');
  const [selectedJob, setSelectedJob] = useState<JobCardProps | null>(null);

  // Filter news items by category
  const newsItems = sampleNews;
  const resourceItems = sampleResource;
  const opportunityItems = sampleOpportunity;

  // Filter news based on sub-tabs
  const recentNews = filterRecentNews(newsItems);
  const editorsPickNews = filterEditorsPickNews(newsItems);
  const mostReadNews = filterMostReadNews(newsItems);

  return (
    <div className="container space-y-6">
      <div className="flex items-center justify-between">
        <Tabs defaultValue="news" className="w-full">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center justify-start gap-4">
              <TabsList className="h-12 w-full">
                <TabsTrigger
                  value="news"
                  className={`h-10`}
                  onClick={() => setActiveTab('news')}
                >
                  News
                </TabsTrigger>
                <TabsTrigger
                  value="resources"
                  className={`h-10`}
                  onClick={() => setActiveTab('resources')}
                >
                  Resources
                </TabsTrigger>
                <TabsTrigger
                  value="opportunities"
                  className={`h-10`}
                  onClick={() => setActiveTab('opportunities')}
                >
                  Opportunities
                </TabsTrigger>
              </TabsList>
            </div>
            <IconButton
              leftIcon="plusCircle"
              label={`Create ${activeTab === 'news' ? 'News' : activeTab === 'resources' ? 'Resource' : 'Opportunity'} Item`}
              className="h-12 w-fit bg-secondary-500"
              onClick={() => router.push(`/news/create?mode=${activeTab}`)}
            />
          </div>

          <TabsContent value="news" className="flex w-full gap-8">
            <div className="flex w-full flex-col gap-6">
              <FeaturedNewsCard {...sampleNews[0]} />

              <Tabs
                defaultValue="recent"
                className="w-full rounded-3xl bg-white p-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    {newsSubTab === 'recent'
                      ? 'Recent News'
                      : newsSubTab === 'editors-pick'
                        ? "Editor's Pick"
                        : 'Most Read'}
                  </h3>
                  <TabsList className="mb-6">
                    <TabsTrigger
                      value="recent"
                      className={`h-10`}
                      onClick={() => setNewsSubTab('recent')}
                    >
                      Recent News
                    </TabsTrigger>
                    <TabsTrigger
                      value="editors-pick"
                      className={`h-10`}
                      onClick={() => setNewsSubTab('editors-pick')}
                    >
                      Editor&apos;s Pick
                    </TabsTrigger>
                    <TabsTrigger
                      value="most-read"
                      className={`h-10`}
                      onClick={() => setNewsSubTab('most-read')}
                    >
                      Most Read
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="recent" className="flex w-full gap-6">
                  {recentNews.map((item) => (
                    <NewsCard key={item.id} {...item} mode={activeTab} />
                  ))}
                </TabsContent>

                <TabsContent value="editors-pick" className="flex w-full gap-6">
                  {editorsPickNews.map((item) => (
                    <NewsCard key={item.id} {...item} mode={activeTab} />
                  ))}
                </TabsContent>

                <TabsContent value="most-read" className="flex w-full gap-6">
                  {mostReadNews.map((item) => (
                    <NewsCard key={item.id} {...item} mode={activeTab} />
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent
            value="resources"
            className="flex w-full flex-col gap-6 rounded-2xl bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <h2>Templates and Files</h2>
              <div className="flex w-fit">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Template" />
                  </SelectTrigger>
                  <SelectContent>
                    {resourceTypes.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-6">
              {resourceItems.map((item) => (
                <NewsCard key={item.id} {...item} mode={activeTab} />
              ))}
            </div>
          </TabsContent>

          <TabsContent
            value="opportunities"
            className="flex w-full flex-col gap-6 rounded-2xl bg-white p-6"
          >
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
                <ExpandedJobCard {...selectedJob} />
              </>
            ) : (
              <>
                <h2>Job Opportunities</h2>
                {opportunityItems.map((item) => (
                  <JobCard
                    key={item.id}
                    {...item}
                    onLearnMore={() => setSelectedJob(item)}
                  />
                ))}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
