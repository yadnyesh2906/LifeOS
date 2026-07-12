import { useState, useEffect } from 'react';
import dashboardService from '../services/dashboardService';
import { DashboardDTO } from '../types/Dashboard';

export const useDashboard = () => {
  const [data, setData] = useState<DashboardDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await dashboardService.getDashboardData();
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || 'Failed to fetch dashboard data');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return { data, isLoading, error, refetch: fetchDashboardData };
};

export default useDashboard;
