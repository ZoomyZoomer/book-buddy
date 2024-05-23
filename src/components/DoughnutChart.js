// DoughnutChart.js
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register required components from Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DoughnutChart = ({ data, options }) => {
    return (
        <div className="chart-container">
            <Doughnut data={data} options={options} />
        </div>
    );
};

export default DoughnutChart;