import { Component, OnInit, ViewChild } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss']
})
export class AnalyticsPageComponent implements OnInit {
  isLoading = true;
  weatherLoading = true;

  // Overview
  overview: any = {};

  // Insights
  insights: any[] = [];

  // Weather
  weather: any = null;
  weatherInsights: any[] = [];
  weatherForecast: any = null;

  // Monthly Trend Chart
  monthlyChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  monthlyChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16, font: { size: 12 } } }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f0f0f0' }, ticks: { callback: (v) => '₹' + Number(v).toLocaleString() } },
      x: { grid: { display: false } }
    }
  };

  // Prediction Chart
  predictionChartData: ChartData<'line'> = { labels: [], datasets: [] };
  predictionChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16, font: { size: 12 } } }
    },
    scales: {
      y: { grid: { color: '#f0f0f0' }, ticks: { callback: (v) => '₹' + Number(v).toLocaleString() } },
      x: { grid: { display: false } }
    }
  };

  // Egg Production Chart
  eggChartData: ChartData<'line'> = { labels: [], datasets: [] };
  eggChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16, font: { size: 12 } } }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f0f0f0' } },
      x: { grid: { display: false }, ticks: { maxTicksLimit: 10 } }
    }
  };

  // Expense Breakdown Chart
  expenseChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  expenseChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, padding: 12, font: { size: 12 } } }
    }
  };

  // Revenue by Product Chart
  revenueChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  revenueChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, padding: 12, font: { size: 12 } } }
    }
  };

  eggTrend = 'stable';

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadAnalytics();
    this.loadWeather();
  }

  loadAnalytics(): void {
    this.isLoading = true;
    this.analyticsService.getAnalytics().subscribe({
      next: (data) => {
        this.overview = data.overview || {};
        this.insights = data.insights || [];
        this.eggTrend = data.eggTrend || 'stable';
        this.buildMonthlyChart(data.monthlyTrend || []);
        this.buildPredictionChart(data.monthlyTrend || [], data.predictions || []);
        this.buildEggChart(data.dailyEggData || []);
        this.buildExpenseChart(data.expenseBreakdown || []);
        this.buildRevenueChart(data.revenueByProduct || []);
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  loadWeather(): void {
    this.weatherLoading = true;
    this.analyticsService.getWeather().subscribe({
      next: (data) => {
        this.weather = data.current;
        this.weatherInsights = data.insights || [];
        this.weatherForecast = data.forecast;
        this.weatherLoading = false;
      },
      error: () => { this.weatherLoading = false; }
    });
  }

  buildMonthlyChart(data: any[]): void {
    this.monthlyChartData = {
      labels: data.map(d => d.label),
      datasets: [
        { data: data.map(d => d.revenue), label: 'Revenue', backgroundColor: '#81251d', borderRadius: 6, barPercentage: 0.6 },
        { data: data.map(d => d.expenses), label: 'Expenses', backgroundColor: '#D5B251', borderRadius: 6, barPercentage: 0.6 },
        { data: data.map(d => d.profit), label: 'Profit', backgroundColor: '#22c55e', borderRadius: 6, barPercentage: 0.6 }
      ]
    };
  }

  buildPredictionChart(history: any[], predictions: any[]): void {
    const historyLabels = history.map(d => d.label);
    const predLabels = predictions.map(d => d.label);
    const allLabels = [...historyLabels, ...predLabels];

    const historyProfits = history.map(d => d.profit);
    const predProfits = predictions.map(d => d.predictedProfit);

    this.predictionChartData = {
      labels: allLabels,
      datasets: [
        {
          data: [...historyProfits, ...new Array(predLabels.length).fill(null)],
          label: 'Actual Profit',
          borderColor: '#81251d',
          backgroundColor: 'rgba(129, 37, 29, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4
        },
        {
          data: [...new Array(historyLabels.length - 1).fill(null), historyProfits[historyProfits.length - 1], ...predProfits],
          label: 'Predicted Profit',
          borderColor: '#D5B251',
          backgroundColor: 'rgba(213, 178, 81, 0.1)',
          borderDash: [5, 5],
          fill: true,
          tension: 0.4,
          pointRadius: 4
        }
      ]
    };
  }

  buildEggChart(data: any[]): void {
    this.eggChartData = {
      labels: data.map(d => d.date.slice(5)),
      datasets: [
        {
          data: data.map(d => d.eggs),
          label: 'Eggs Collected',
          borderColor: '#D5B251',
          backgroundColor: 'rgba(213, 178, 81, 0.15)',
          fill: true,
          tension: 0.3,
          pointRadius: 2
        },
        {
          data: data.map(d => d.deaths),
          label: 'Bird Deaths',
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: false,
          tension: 0.3,
          pointRadius: 2
        }
      ]
    };
  }

  buildExpenseChart(data: any[]): void {
    const colors = ['#81251d', '#D5B251', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6'];
    this.expenseChartData = {
      labels: data.map(d => d.category || 'Other'),
      datasets: [{
        data: data.map(d => d.total),
        backgroundColor: colors.slice(0, data.length),
        borderWidth: 0
      }]
    };
  }

  buildRevenueChart(data: any[]): void {
    const colors = ['#81251d', '#D5B251', '#22c55e', '#3b82f6', '#8b5cf6'];
    this.revenueChartData = {
      labels: data.map(d => d.product || 'Other'),
      datasets: [{
        data: data.map(d => d.total),
        backgroundColor: colors.slice(0, data.length),
        borderWidth: 0
      }]
    };
  }

  getInsightIcon(type: string): string {
    switch (type) {
      case 'positive': return 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'warning': return 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z';
      case 'critical': return 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z';
      default: return 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z';
    }
  }

  getInsightColor(type: string): string {
    switch (type) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-amber-600 bg-amber-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  }

  getInsightBorder(type: string): string {
    switch (type) {
      case 'positive': return 'border-l-green-500';
      case 'warning': return 'border-l-amber-500';
      case 'critical': return 'border-l-red-500';
      default: return 'border-l-blue-500';
    }
  }

  getWeatherIcon(code: number): string {
    if (!code && code !== 0) return 'cloud';
    if (code === 0) return 'sun';
    if (code <= 3) return 'cloud-sun';
    if (code <= 48) return 'cloud';
    if (code <= 67) return 'cloud-rain';
    if (code <= 77) return 'snowflake';
    return 'cloud-bolt';
  }
}
