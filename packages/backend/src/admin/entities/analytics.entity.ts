import { ApiProperty } from '@nestjs/swagger';

export class OverviewMetrics {
  @ApiProperty({ description: 'Total number of users' })
  totalUsers: number;

  @ApiProperty({
    description: 'User count change percentage from previous period',
  })
  userGrowthRate: number;

  @ApiProperty({ description: 'User engagement rate as percentage' })
  engagementRate: number;

  @ApiProperty({ description: 'Engagement rate change from previous period' })
  engagementRateChange: number;
}

export class ChartDataPoint {
  @ApiProperty({ description: 'Label for the data point (e.g., month)' })
  label: string;

  @ApiProperty({ description: 'Value for the data point' })
  value: number;
}

export class NewUsersData {
  @ApiProperty({ description: 'Current total number of new users' })
  currentValue: number;

  @ApiProperty({
    description: 'Chart data for new users trend',
    type: [ChartDataPoint],
  })
  chartData: ChartDataPoint[];
}

export class UserDistributionItem {
  @ApiProperty({ description: 'Name of the distribution category' })
  name: string;

  @ApiProperty({ description: 'Value as percentage or count' })
  value: number;

  @ApiProperty({ description: 'Color code for charts' })
  color: string;
}

export class UserDistribution {
  @ApiProperty({ description: 'Total user count' })
  totalUsers: number;

  @ApiProperty({
    description: 'Distribution data',
    type: [UserDistributionItem],
  })
  data: UserDistributionItem[];
}

export class UserActivityMetrics {
  @ApiProperty({ description: 'Activity type' })
  type: string;

  @ApiProperty({ description: 'Count of activities' })
  count: number;
}
