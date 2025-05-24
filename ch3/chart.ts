import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import fs from 'fs';
import path from 'path';

/**
 * Interface for a data series in the chart
 */
interface DataSeries {
  label: string;
  xValues: number[];
  yValues: number[];
  backgroundColor?: string;
  borderColor?: string;
}

/**
 * Generates a chart with multiple XY series and saves it as a PNG file
 * @param dataSeries - Array of data series to plot
 * @param options - Configuration options for the chart
 */
async function generateXYChart(
  dataSeries: DataSeries[],
  options: {
    width?: number;
    height?: number;
    outputPath?: string;
    title?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
  } = {}
): Promise<string> {
  if (!dataSeries || dataSeries.length === 0) {
    throw new Error('At least one data series must be provided');
  }

  // Set default options
  const {
    width = 800,
    height = 600,
    outputPath = './chart.png',
    title = 'XY Chart',
    xAxisLabel = 'X Axis',
    yAxisLabel = 'Y Axis'
  } = options;

  // Create canvas instance
  const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width,
    height,
    backgroundColour: 'white' // Canvas background
  });

  // Define default colors for series if not provided
  const defaultColors = [
    { bg: 'rgba(75, 192, 192, 0.2)', border: 'rgba(75, 192, 192, 1)' },
    { bg: 'rgba(255, 99, 132, 0.2)', border: 'rgba(255, 99, 132, 1)' },
    { bg: 'rgba(54, 162, 235, 0.2)', border: 'rgba(54, 162, 235, 1)' },
    { bg: 'rgba(255, 206, 86, 0.2)', border: 'rgba(255, 206, 86, 1)' },
    { bg: 'rgba(153, 102, 255, 0.2)', border: 'rgba(153, 102, 255, 1)' }
  ];

  // Create datasets from the provided series
  const datasets = dataSeries.map((series, index) => {
    const colorIndex = index % defaultColors.length;
    return {
      label: series.label || `Series ${index + 1}`,
      data: series.xValues.map((x, i) => ({ x, y: series.yValues[i] })),
      backgroundColor: series.backgroundColor || defaultColors[colorIndex].bg,
      borderColor: series.borderColor || defaultColors[colorIndex].border,
      borderWidth: 2,
      pointRadius: 1,
      pointBackgroundColor: series.borderColor || defaultColors[colorIndex].border,
      showLine: true,
      fill: false
    };
  });

  // Configure the chart
  const configuration = {
    type: 'line',
    data: { datasets },
    options: {
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 18
          }
        },
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          title: {
            display: true,
            text: xAxisLabel
          }
        },
        y: {
          title: {
            display: true,
            text: yAxisLabel
          }
        }
      }
    }
  };

  // Generate chart image
  const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
  
  // Ensure the directory exists
  const directory = path.dirname(outputPath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  
  // Save chart to file
  fs.writeFileSync(outputPath, buffer);
  
  console.log(`Chart successfully generated and saved to: ${outputPath}`);
  return outputPath;
}

/**
 * Simpler function to generate a chart with two XY data series
 * @param xValues1 - X values for the first series
 * @param yValues1 - Y values for the first series
 * @param xValues2 - X values for the second series
 * @param yValues2 - Y values for the second series
 * @param options - Configuration options for the chart
 */
async function generateTwoLineChart(
  xValues1: number[],
  yValues1: number[],
  xValues2: number[],
  yValues2: number[],
  options: {
    label1?: string;
    label2?: string;
    color1?: { bg?: string; border?: string };
    color2?: { bg?: string; border?: string };
    width?: number;
    height?: number;
    outputPath?: string;
    title?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
  } = {}
): Promise<string> {
  if (xValues1.length !== yValues1.length) {
    throw new Error('First series X and Y arrays must have the same length');
  }
  
  if (xValues2.length !== yValues2.length) {
    throw new Error('Second series X and Y arrays must have the same length');
  }

  const dataSeries: DataSeries[] = [
    {
      label: options.label1 || 'Series 1',
      xValues: xValues1,
      yValues: yValues1,
      backgroundColor: options.color1?.bg || 'rgba(75, 192, 192, 0.2)',
      borderColor: options.color1?.border || 'rgba(75, 192, 192, 1)'
    },
    {
      label: options.label2 || 'Series 2',
      xValues: xValues2,
      yValues: yValues2,
      backgroundColor: options.color2?.bg || 'rgba(255, 99, 132, 0.2)',
      borderColor: options.color2?.border || 'rgba(255, 99, 132, 1)'
    }
  ];

  return generateXYChart(dataSeries, {
    width: options.width,
    height: options.height,
    outputPath: options.outputPath,
    title: options.title,
    xAxisLabel: options.xAxisLabel,
    yAxisLabel: options.yAxisLabel
  });
}

// Original function for single array data (kept for backward compatibility)
async function generateChart(
  data: number[],
  options: {
    width?: number;
    height?: number;
    outputPath?: string;
    backgroundColor?: string;
    borderColor?: string;
    title?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
    yMax?: number;
  } = {}
): Promise<string> {
  // Set default options
  const {
    width = 800,
    height = 600,
    outputPath = './chart.png',
    backgroundColor = 'rgba(75, 192, 192, 0.2)',
    borderColor = 'rgba(75, 192, 192, 1)',
    title = 'Data Chart',
    xAxisLabel = 'X Axis',
    yAxisLabel = 'Value',
    yMax
  } = options;

  // Create canvas instance
  const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width,
    height,
    backgroundColour: 'white' // Canvas background
  });

  // Create labels for x-axis (1, 2, 3, etc.)
  const labels = Array.from({ length: data.length }, (_, i) => (i + 1).toString());

  // Configure the chart

  // Generate chart image
  const buffer = await chartJSNodeCanvas.renderToBuffer({
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Data',
            data,
            backgroundColor,
            borderColor,
            borderWidth: 2,
            pointRadius: 1,
            pointBackgroundColor: borderColor
          }
        ]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: title,
            font: {
              size: 18
            }
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: xAxisLabel
            }
          },
          y: {
            title: {
              display: true,
              text: yAxisLabel
            },
            beginAtZero: true,
            max: yMax
          }
        }
      }
    });
  
  // Ensure the directory exists
  const directory = path.dirname(outputPath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  
  // Save chart to file
  fs.writeFileSync(outputPath, buffer);
  
  console.log(`Chart successfully generated and saved to: ${outputPath}`);
  return outputPath;
}

// Example usage
async function main() {
  // Example with single data series
  const sampleData = [12, 19, 3, 5, 2, 3, 20, 33, 23, 12, 43, 16];
  await generateChart(sampleData, {
    title: 'Sample Data Visualization',
    xAxisLabel: 'Data Points',
    yAxisLabel: 'Values',
    outputPath: './output/sample-chart.png'
  });
  
  // Example with two XY series
  const xValues1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const yValues1 = [5, 7, 12, 15, 18, 21, 22, 24, 27, 30];
  
  const xValues2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const yValues2 = [10, 14, 16, 14, 12, 15, 19, 22, 25, 23];
  
  await generateTwoLineChart(
    xValues1, yValues1, 
    xValues2, yValues2, 
    {
      label1: 'Series A',
      label2: 'Series B',
      title: 'Two Series Comparison',
      xAxisLabel: 'X Values',
      yAxisLabel: 'Y Values',
      outputPath: './output/two-series-chart.png'
    }
  );
}

// Run the example if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { generateChart, generateXYChart, generateTwoLineChart };
