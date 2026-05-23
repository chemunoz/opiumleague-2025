import { Injectable } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string | string[];
  fill?: boolean;
  tension?: number;
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      display?: boolean;
      position?: 'top' | 'bottom' | 'left' | 'right';
    };
    title?: {
      display?: boolean;
      text?: string;
    };
  };
  scales?: {
    x?: {
      display?: boolean;
      title?: {
        display?: boolean;
        text?: string;
      };
    };
    y?: {
      display?: boolean;
      title?: {
        display?: boolean;
        text?: string;
      };
      beginAtZero?: boolean;
      reverse?: boolean;
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  private charts = new Map<string, Chart>();

  createLineChart(
    canvasId: string,
    labels: string[],
    datasets: {
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
    }[],
    options?: ChartOptions,
  ): Chart {
    const existingChart = this.charts.get(canvasId);
    if (existingChart) {
      existingChart.destroy();
    }

    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`Canvas element with id '${canvasId}' not found`);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error(`Could not get 2D context for canvas '${canvasId}'`);
    }

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: datasets.map((ds) => ({
          label: ds.label,
          data: ds.data,
          borderColor: ds.borderColor || '#e94560',
          backgroundColor: ds.backgroundColor || 'rgba(233, 69, 96, 0.1)',
          fill: true,
          tension: 0.4,
        })),
      },
      options: {
        responsive: options?.responsive ?? true,
        maintainAspectRatio: options?.maintainAspectRatio ?? false,
        plugins: {
          legend: {
            display: options?.plugins?.legend?.display ?? true,
            position: options?.plugins?.legend?.position ?? 'top',
          },
          title: {
            display: options?.plugins?.title?.display ?? false,
            text: options?.plugins?.title?.text ?? '',
          },
        },
        scales: {
          x: {
            display: options?.scales?.x?.display ?? true,
            title: {
              display: options?.scales?.x?.title?.display ?? false,
              text: options?.scales?.x?.title?.text ?? '',
            },
          },
          y: {
            display: options?.scales?.y?.display ?? true,
            title: {
              display: options?.scales?.y?.title?.display ?? false,
              text: options?.scales?.y?.title?.text ?? '',
            },
            beginAtZero: options?.scales?.y?.beginAtZero ?? true,
          },
        },
      },
    };

    const chart = new Chart(ctx, config);
    this.charts.set(canvasId, chart);
    return chart;
  }

  createBarChart(
    canvasId: string,
    labels: string[],
    datasets: ChartDataset[],
    options?: ChartOptions,
  ): Chart {
    const existingChart = this.charts.get(canvasId);
    if (existingChart) {
      existingChart.destroy();
    }

    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`Canvas element with id '${canvasId}' not found`);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error(`Could not get 2D context for canvas '${canvasId}'`);
    }

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: datasets.map((ds) => ({
          label: ds.label,
          data: ds.data,
          backgroundColor: ds.backgroundColor || '#e94560',
        })),
      },
      options: {
        responsive: options?.responsive ?? true,
        maintainAspectRatio: options?.maintainAspectRatio ?? false,
        plugins: {
          legend: {
            display: options?.plugins?.legend?.display ?? true,
            position: options?.plugins?.legend?.position ?? 'top',
          },
        },
        scales: {
          x: {
            display: options?.scales?.x?.display ?? true,
          },
          y: {
            display: options?.scales?.y?.display ?? true,
            beginAtZero: options?.scales?.y?.beginAtZero ?? true,
          },
        },
      },
    };

    const chart = new Chart(ctx, config);
    this.charts.set(canvasId, chart);
    return chart;
  }

  createPieChart(
    canvasId: string,
    labels: string[],
    data: number[],
    colors?: string[],
  ): Chart {
    const existingChart = this.charts.get(canvasId);
    if (existingChart) {
      existingChart.destroy();
    }

    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`Canvas element with id '${canvasId}' not found`);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error(`Could not get 2D context for canvas '${canvasId}'`);
    }

    const defaultColors = [
      '#e94560',
      '#16213e',
      '#0f3460',
      '#533483',
      '#e63946',
      '#2a9d8f',
      '#e9c46a',
      '#f4a261',
      '#264653',
      '#6a0572',
    ];

    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors || defaultColors.slice(0, data.length),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'right',
          },
        },
      },
    };

    const chart = new Chart(ctx, config);
    this.charts.set(canvasId, chart);
    return chart;
  }

  destroyChart(canvasId: string): void {
    const chart = this.charts.get(canvasId);
    if (chart) {
      chart.destroy();
      this.charts.delete(canvasId);
    }
  }

  destroyAllCharts(): void {
    this.charts.forEach((chart) => chart.destroy());
    this.charts.clear();
  }
}
