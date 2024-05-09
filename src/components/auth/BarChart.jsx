import React from 'react';
import { Bar } from 'react-chartjs-2';

function BarChart({ data }) {
    // 응답 데이터에서 키와 값 추출
    const labels = Object.keys(data);
    const values = Object.values(data);

    // 그래프 데이터 생성
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Values',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    // 그래프 옵션 설정
    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            <h2>Bar Chart</h2>
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
}

export default BarChart;
