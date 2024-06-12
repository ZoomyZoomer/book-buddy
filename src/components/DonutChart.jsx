import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart, ArcElement } from 'chart.js';
import { useEffect } from 'react';
Chart.register(ArcElement);

ChartJS.register(ChartDataLabels);

const DonutChart = () => {
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [hoveredSegment2, setHoveredSegment2] = useState(null);

  const outerData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: 'Percentage',
        data: [70, 30],
        backgroundColor: [
          'rgb(255, 169, 169)',
          'rgb(169, 209, 255)',
        ],
        borderColor: [
          '#fff',
          '#fff',
          '#fff',
          '#fff',
          '#fff',
          '#fff',
        ],
        borderWidth: 1,
      },
    ],
  };

  const outerOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false, // Disable tooltips
      },
      datalabels: {
        display: false,
      },
    },
    cutout: '75%',
    onHover: (_, elements) => {
      if (elements.length) {
        setHoveredSegment(elements[0].index);
      } else {
        setHoveredSegment(null);
      }
    },
    onLeave: (_, elements) => {
      setHoveredSegment(null); // Reset hovered segment when cursor leaves the chart
    },
  };

  const innerData = {
    labels: ['Finished', 'Reading'],
    datasets: [
      {
        label: 'Inner Chart Data',
        data: [70, 30],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
        ],
        borderColor: [
          '#fff',
          '#fff',
        ],
        borderWidth: 1,
      },
    ],
  };

  const innerOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false, // Disable tooltips
      },
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 20,
          right: 20,
        },
      },
      datalabels: {
        color: '#000',
        font: {
          size: '12', // Set font size for labels
          family: 'Inter',
          weight: '500',
        },
        formatter: (value, context) => {
          const label = context.chart.data.labels[context.dataIndex];
          const percentage = context.dataset.data[context.dataIndex] + '%';
          return [label, percentage];
        },
        align: 'center', // Center-align the labels
      },
    },
    onHover: (_, elements) => {
      if (elements.length) {
        setHoveredSegment2(elements[0].index);
      } else {
        setHoveredSegment2(null);
      }
    },
    onLeave: (_, elements) => {
      setHoveredSegment2(null); // Reset hovered segment when cursor leaves the chart
    },
    cutout: '50%',
  };

  // Set cursor pointer style when a segment is hovered over
  const outerElementStyle = {
    cursor: hoveredSegment !== null ? 'pointer' : 'default',
  };

  const innerElementStyle = {
    cursor: hoveredSegment2 !== null ? 'pointer' : 'default',
  };

  useEffect(() => {
    const canvas = document.getElementById('donut-chart-inner');
    const ctx = canvas.getContext('2d');
    const text = 'Books';

    // Measure the width of the text
    const fontSize = 20; // Adjust font size as needed
    ctx.font = `${fontSize}px Inter`;
    const textWidth = ctx.measureText(text).width;

    // Calculate position to center the text
    const x = (canvas.width - textWidth) / 2;
    const y = canvas.height / 2 + fontSize / 4; // Adjust vertical position as needed

    // Draw the text
    ctx.fillStyle = '#000'; // Adjust text color as needed
    ctx.font = `${fontSize}px Inter`;
    ctx.fillText(text, x, y);
  }, []);

  return (
    <div style={{ width: '300px', height: '300px', position: 'relative', zIndex: '1000' }}>
      <Doughnut
        data={outerData}
        options={outerOptions}
        style={outerElementStyle}
      />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width:'230px', height: '230px' }}>
        <Doughnut
          id="donut-chart-inner" // Add id to inner chart canvas
          data={innerData}
          options={innerOptions}
          style={innerElementStyle}
        />
      </div>
     <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', fontFamily: 'Inter' }}>
        Books <br></br> <div style={{color: 'lightgray'}}>2000</div>
     </div>
    </div>
  );
};

export default DonutChart;
