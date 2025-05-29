import { PieChartCard } from './common/pie-chart-card';

interface UserStatusData {
  totalUsers: number;
  deletedUsers: number;
  unverifiedUsers: number;
}

interface UserStatusChartProps {
  data: UserStatusData;
}

export const UserStatusChart = ({ data }: UserStatusChartProps) => {
  const activeUsers =
    data.totalUsers - data.deletedUsers - data.unverifiedUsers;

  const chartData = [
    {
      name: 'Active Users',
      value: activeUsers,
      color: '#5a71b6'
    },
    {
      name: 'Unverified Users',
      value: data.unverifiedUsers,
      color: '#c8cee1'
    },
    {
      name: 'Deleted Users',
      value: data.deletedUsers,
      color: '#f27c7c'
    }
  ];

  return (
    <PieChartCard
      title="Total Users"
      total={data.totalUsers}
      data={chartData}
      showPercentage={true}
    />
  );
};
