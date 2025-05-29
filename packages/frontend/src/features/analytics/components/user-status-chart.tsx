import { PieChartCard } from './common/pie-chart-card';

interface UserStatusData {
  totalUsers: number;
  deletedUsers: number;
  unverifiedUsers: number;
  activeUsersPercentage: number;
  inactiveUsersPercentage: number;
  unverifiedUsersPercentage: number;
  deletedUsersPercentage: number;
}

interface UserStatusChartProps {
  data: UserStatusData;
}

export const UserStatusChart = ({ data }: UserStatusChartProps) => {
  console.log('status data :', data);

  const chartData = [
    {
      name: 'Active',
      value: data.activeUsersPercentage,
      color: '#5a71b6'
    },
    {
      name: 'Inactive',
      value: data.inactiveUsersPercentage,
      color: '#c8cee1'
    },
    {
      name: 'Unverified',
      value: data.unverifiedUsersPercentage,
      color: '#eead53'
    },
    {
      name: 'Deleted',
      value: data.deletedUsersPercentage,
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
