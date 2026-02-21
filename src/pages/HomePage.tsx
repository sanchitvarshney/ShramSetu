import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Skeleton } from 'antd';
import { Area } from '@ant-design/charts';
import {
  FileText,
  Building2,
  Users,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { AppDispatch, RootState } from '@/store';
import { fetchAnalytics } from '@/features/homePage/homePageSlice';

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { analytics, analyticsLoading } = useSelector(
    (state: RootState) => state.homePage
  );

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  if (analyticsLoading && !analytics) {
    return (
      <div className="w-full min-h-full p-4 md:p-6 space-y-6 overflow-x-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="border shadow-sm">
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          ))}
        </div>
        <Card title="Monthly Applications (Last 3 Months)" className="shadow-sm">
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Applications',
      value: analytics?.totalApplications ?? 0,
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    {
      title: 'Applications (Last Month)',
      value: analytics?.applicationsLastMonth ?? 0,
      icon: <Calendar className="w-8 h-8 text-violet-600" />,
      bg: 'bg-violet-50',
      border: 'border-violet-200',
    },
    {
      title: 'Applications (Last Week)',
      value: analytics?.applicationsLastWeek ?? 0,
      icon: <TrendingUp className="w-8 h-8 text-emerald-600" />,
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
    },
    {
      title: 'Total Companies',
      value: analytics?.totalCompanies ?? 0,
      icon: <Building2 className="w-8 h-8 text-amber-600" />,
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
    {
      title: 'Total Workers',
      value: analytics?.totalWorkers ?? 0,
      icon: <Users className="w-8 h-8 text-rose-600" />,
      bg: 'bg-rose-50',
      border: 'border-rose-200',
    },
  ];

  const chartData =
    analytics?.monthlyApplications?.map((item:any) => ({
      month: item.month,
      applications: item.totalApplications,
    })) ?? [];

  const chartHeight = 380;
  const areaConfig = {
    data: chartData,
    xField: 'month',
    yField: 'applications',
    height: chartHeight,
    autoFit: true,
    tooltip: {},
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    yAxis: {
      label: {
        formatter: (v: string) => v,
      },
    },
    meta: {
      month: { alias: 'Month' },
      applications: { alias: 'Applications' },
    },
    color: '#5B8FF9',
    smooth: true,
    areaStyle: () => ({ fillOpacity: 0.5 }),
    point: { size: 4, shape: 'circle' },
  };

  return (
    <div className="w-full max-h-[calc(100vh- 120px)] p-4 md:p-6 space-y-6 overflow-hidden min-w-0">
   
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 min-w-0">
        {cards.map((card) => (
          <Card
            key={card.title}
            className={`${card.bg} ${card.border} border shadow-sm hover:shadow-md transition-shadow`}
            bodyStyle={{ padding: '1rem 1.25rem' }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-600 m-0">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1 m-0">
                  {Number(card.value).toLocaleString()}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${card.bg}`}>{card.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card
        title="Monthly Applications (Last 3 Months)"
        className="shadow-sm min-w-0 overflow-hidden"
        bodyStyle={{ padding: '1.25rem' }}
      >
        <div className="min-w-0 w-full overflow-hidden" style={{ height: chartHeight }}>
          {chartData.length > 0 ? (
            <Area {...areaConfig} height={chartHeight} style={{ maxWidth: '100%' }} />
          ) : (
            <div className="flex items-center justify-center text-gray-500" style={{ height: chartHeight }}>
              No monthly data available
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default HomePage;
