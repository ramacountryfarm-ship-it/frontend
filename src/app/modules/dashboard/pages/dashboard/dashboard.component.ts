import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { DashboardService } from '../../services/dashboard.service';

interface DashboardStats {
  birdsAlive: number;
  eggsToday: number;
  feedUsedToday: string;
  eggStock: number;
  profitThisMonth: number;
  allTimeProfit: number;
  allTimeSales: number;
  allTimeInvestments: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    birdsAlive: 0,
    eggsToday: 0,
    feedUsedToday: '0 kg',
    eggStock: 0,
    profitThisMonth: 0,
    allTimeProfit: 0,
    allTimeSales: 0,
    allTimeInvestments: 0
  };

  // Date filter for charts
  chartFrom = '';
  chartTo = '';
  chartRangeLabel = 'Last 7 Days';

  // ── Egg Production (Bar chart) ──
  eggChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Eggs',
      backgroundColor: (ctx: any) => {
        const chart = ctx.chart;
        const { ctx: c, chartArea } = chart;
        if (!chartArea) return 'rgba(255, 149, 0, 0.8)';
        const gradient = c.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, 'rgba(255, 149, 0, 0.55)');
        gradient.addColorStop(1, 'rgba(255, 149, 0, 0.92)');
        return gradient;
      },
      hoverBackgroundColor: 'rgba(255, 149, 0, 1)',
      borderRadius: 6,
      borderSkipped: false,
      barThickness: 24,
      maxBarThickness: 32
    }]
  };

  eggChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800, easing: 'easeOutQuart' },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(29, 29, 31, 0.95)',
        titleFont: { size: 11, weight: 'normal', family: 'Inter, system-ui, sans-serif' },
        bodyFont: { size: 14, weight: 'bold', family: 'Inter, system-ui, sans-serif' },
        padding: { top: 8, bottom: 8, left: 14, right: 14 },
        cornerRadius: 10,
        displayColors: false,
        callbacks: { label: (ctx: any) => `${ctx.parsed.y} eggs` }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: 'rgba(0, 0, 0, 0.04)', drawTicks: false },
        ticks: { font: { size: 11, family: 'Inter, system-ui, sans-serif' }, color: '#86868b', padding: 10 }
      },
      x: {
        border: { display: false },
        grid: { display: false },
        ticks: { font: { size: 11, family: 'Inter, system-ui, sans-serif' }, color: '#86868b', padding: 6 }
      }
    }
  };

  // ── Feed Consumption (Area/Line chart) ──
  feedChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Feed (kg)',
      borderColor: '#AF52DE',
      backgroundColor: (ctx: any) => {
        const chart = ctx.chart;
        const { ctx: c, chartArea } = chart;
        if (!chartArea) return 'rgba(175, 82, 222, 0.1)';
        const gradient = c.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, 'rgba(175, 82, 222, 0.01)');
        gradient.addColorStop(0.5, 'rgba(175, 82, 222, 0.08)');
        gradient.addColorStop(1, 'rgba(175, 82, 222, 0.2)');
        return gradient;
      },
      fill: true,
      tension: 0.4,
      borderWidth: 2.5,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: '#AF52DE',
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 3
    }]
  };

  feedChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800, easing: 'easeOutQuart' },
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(29, 29, 31, 0.95)',
        titleFont: { size: 11, weight: 'normal', family: 'Inter, system-ui, sans-serif' },
        bodyFont: { size: 14, weight: 'bold', family: 'Inter, system-ui, sans-serif' },
        padding: { top: 8, bottom: 8, left: 14, right: 14 },
        cornerRadius: 10,
        displayColors: false,
        callbacks: { label: (ctx: any) => `${ctx.parsed.y} kg` }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: 'rgba(0, 0, 0, 0.04)', drawTicks: false },
        ticks: { font: { size: 11, family: 'Inter, system-ui, sans-serif' }, color: '#86868b', padding: 10 }
      },
      x: {
        border: { display: false },
        grid: { display: false },
        ticks: { font: { size: 11, family: 'Inter, system-ui, sans-serif' }, color: '#86868b', padding: 6 }
      }
    }
  };

  // ── Bird Sales (Bar chart) ──
  salesChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Revenue',
      backgroundColor: (ctx: any) => {
        const chart = ctx.chart;
        const { ctx: c, chartArea } = chart;
        if (!chartArea) return 'rgba(52, 199, 89, 0.8)';
        const gradient = c.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, 'rgba(52, 199, 89, 0.5)');
        gradient.addColorStop(1, 'rgba(52, 199, 89, 0.9)');
        return gradient;
      },
      hoverBackgroundColor: 'rgba(52, 199, 89, 1)',
      borderRadius: 6,
      borderSkipped: false,
      barThickness: 24,
      maxBarThickness: 32
    }]
  };

  salesChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800, easing: 'easeOutQuart' },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(29, 29, 31, 0.95)',
        titleFont: { size: 11, weight: 'normal', family: 'Inter, system-ui, sans-serif' },
        bodyFont: { size: 14, weight: 'bold', family: 'Inter, system-ui, sans-serif' },
        padding: { top: 8, bottom: 8, left: 14, right: 14 },
        cornerRadius: 10,
        displayColors: false,
        callbacks: { label: (ctx: any) => `₹${ctx.parsed.y.toLocaleString()}` }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: 'rgba(0, 0, 0, 0.04)', drawTicks: false },
        ticks: {
          font: { size: 11, family: 'Inter, system-ui, sans-serif' },
          color: '#86868b',
          padding: 10,
          callback: (value: any) => '₹' + (value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value)
        }
      },
      x: {
        border: { display: false },
        grid: { display: false },
        ticks: { font: { size: 11, family: 'Inter, system-ui, sans-serif' }, color: '#86868b', padding: 6 }
      }
    }
  };

  totalSales7d = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadCharts();
  }

  private loadStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = {
          birdsAlive: data.totalBirdsAlive || 0,
          eggsToday: data.eggsToday || 0,
          feedUsedToday: (data.feedTodayKg || 0) + ' kg',
          eggStock: data.eggStock || 0,
          profitThisMonth: data.profitThisMonth || 0,
          allTimeProfit: data.allTimeProfit || 0,
          allTimeSales: data.allTimeSales || 0,
          allTimeInvestments: data.allTimeInvestments || 0
        };
      },
      error: () => {}
    });
  }

  private formatDateLabel(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    const daysDiff = this.getDateRangeDays();
    if (daysDiff <= 14) {
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (daysDiff <= 60) {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }

  private getDateRangeDays(): number {
    if (!this.chartFrom || !this.chartTo) return 7;
    const from = new Date(this.chartFrom);
    const to = new Date(this.chartTo);
    return Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  onChartFilter(): void {
    if (this.chartFrom && this.chartTo) {
      const from = new Date(this.chartFrom);
      const to = new Date(this.chartTo);
      if (from > to) return;
      const days = this.getDateRangeDays();
      this.chartRangeLabel = days + ' Days';
      this.loadCharts();
    }
  }

  onResetFilter(): void {
    this.chartFrom = '';
    this.chartTo = '';
    this.chartRangeLabel = 'Last 7 Days';
    this.loadCharts();
  }

  private loadCharts(): void {
    this.dashboardService.getCharts(this.chartFrom, this.chartTo).subscribe({
      next: (data) => {
        if (data.eggTrend) {
          this.eggChartData = {
            ...this.eggChartData,
            labels: data.eggTrend.map((d: any) => this.formatDateLabel(d.date)),
            datasets: [{ ...this.eggChartData.datasets[0], data: data.eggTrend.map((d: any) => d.eggs) }]
          };
        }
        if (data.feedTrend) {
          this.feedChartData = {
            ...this.feedChartData,
            labels: data.feedTrend.map((d: any) => this.formatDateLabel(d.date)),
            datasets: [{ ...this.feedChartData.datasets[0], data: data.feedTrend.map((d: any) => d.feedKg) }]
          };
        }
        if (data.salesTrend) {
          this.totalSales7d = data.salesTrend.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);
          this.salesChartData = {
            ...this.salesChartData,
            labels: data.salesTrend.map((d: any) => this.formatDateLabel(d.date)),
            datasets: [{ ...this.salesChartData.datasets[0], data: data.salesTrend.map((d: any) => d.amount) }]
          };
        }
      },
      error: () => {}
    });
  }
}
