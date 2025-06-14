/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { AnalyticsSelect } from './common/analytics-select';
import { DownloadIcon, LucideUserMinus, Users } from 'lucide-react';
import { PieChartCard } from './common/pie-chart-card';
import { UserActivity } from './user-activity';
import { ChartCard } from './common/chart-card';
import { MetricCard } from './metric-card';
import { UserStatusChart } from './user-status-chart';
import { useAdminStore } from '@/features/admin/store/admin-store';
import { AnalyticsPeriod } from '@/features/admin/types';
import { UserX } from 'lucide-react';
import { ExportReportModal } from './export-report-modal';

export const selectOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' }
];

export const Analytics = () => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const {
    overviewMetrics,
    newUsersData,
    userDistribution,
    userActivityData,
    analyticsLoading,
    analyticsError,
    selectedPeriod,
    setSelectedPeriod,
    fetchAllAnalytics
  } = useAdminStore();

  useEffect(() => {
    fetchAllAnalytics(selectedPeriod);
  }, []);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period as AnalyticsPeriod);
  };

  const formatChartData = (data: Array<{ label: string; value: number }>) => {
    return data.map((item) => ({
      month: item.label.includes('-')
        ? new Date(item.label).toLocaleDateString('en-US', { month: 'short' })
        : item.label,
      value: item.value
    }));
  };

  if (analyticsError) {
    return (
      <div className="container-wide p-6">
        <div className="flex h-64 items-center justify-center rounded-lg border border-red-200 bg-red-50">
          <p className="text-red-600">
            Error loading analytics: {analyticsError}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container-wide space-y-6 p-6" id="analytics-dashboard">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Monitor your platform&apos;s performance and user engagement
            </p>
          </div>
          <div className="flex items-center gap-4">
            <AnalyticsSelect
              options={selectOptions}
              placeholder="Select period"
              value={selectedPeriod}
              onValueChange={handlePeriodChange}
            />
            <Button
              className="h-10 px-4"
              disabled={analyticsLoading}
              variant="outline"
              onClick={() => setIsExportModalOpen(true)}
            >
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <MetricCard
              title="Total Users"
              value={overviewMetrics?.totalUsers?.toString() || '0'}
              icon={Users}
              trend={
                overviewMetrics
                  ? overviewMetrics.userGrowthRate > 0
                    ? 'up'
                    : 'down'
                  : 'neutral'
              }
              trendValue={`${Math.abs(overviewMetrics?.userGrowthRate || 0)}%`}
              iconColor="bg-blue-500"
            />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <MetricCard
              title="Engagement Rate"
              value={`${overviewMetrics?.engagementRate || 0}%`}
              icon={Users}
              trend={
                overviewMetrics && overviewMetrics.engagementRateChange >= 0
                  ? 'up'
                  : 'down'
              }
              trendValue={`${Math.abs(overviewMetrics?.engagementRateChange || 0)}%`}
              className="border-0 bg-transparent p-0 shadow-none"
              iconColor="bg-emerald-500"
            />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <MetricCard
              title="Deleted Users"
              value={overviewMetrics?.deletedUsers || 0}
              icon={UserX}
              iconColor="bg-red-500"
              trend={overviewMetrics?.deletedUsers === 0 ? 'neutral' : 'down'}
              trendValue={
                overviewMetrics?.deletedUsers === 0 ? '0%' : undefined
              }
            />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <MetricCard
              title="Unverified Users"
              value={overviewMetrics?.unverifiedUsers || 0}
              icon={LucideUserMinus}
              iconColor="bg-amber-500"
              trend={overviewMetrics?.unverifiedUsers === 0 ? 'neutral' : 'up'}
              trendValue={
                overviewMetrics?.unverifiedUsers === 0 ? '0%' : undefined
              }
            />
          </div>
        </div>

        {/* New Users Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              New Users Growth
            </h3>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
              <span className="text-sm text-gray-600">Growth Trend</span>
            </div>
          </div>
          <ChartCard
            data={newUsersData ? formatChartData(newUsersData.chartData) : []}
            title="New Users Analytics"
            currentValue={newUsersData?.currentValue || 0}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* User Status Distribution */}
          <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                User Status Distribution
              </h3>
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
            </div>
            {overviewMetrics ? (
              <UserStatusChart
                data={{
                  totalUsers: overviewMetrics.totalUsers,
                  deletedUsers: overviewMetrics.deletedUsers,
                  unverifiedUsers: overviewMetrics.unverifiedUsers,
                  activeUsersPercentage: overviewMetrics.activeUsersPercentage,
                  inactiveUsersPercentage:
                    overviewMetrics.inactiveUsersPercentage,
                  unverifiedUsersPercentage:
                    overviewMetrics.unverifiedUsersPercentage,
                  deletedUsersPercentage: overviewMetrics.deletedUsersPercentage
                }}
              />
            ) : (
              <PieChartCard
                data={userDistribution?.data || []}
                showPercentage={true}
                title="Total Users"
                total={userDistribution?.totalUsers || 0}
              />
            )}
          </div>

          {/* User Activity */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  User Activity
                </h3>
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              </div>
              <UserActivity
                data={userActivityData || []}
                period={selectedPeriod}
                onPeriodChange={handlePeriodChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        dashboardElementId="analytics-dashboard"
      />
    </>
  );
};
