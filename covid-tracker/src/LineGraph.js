import React, { useState, useEffect } from 'react';
import {Line} from 'react-chartjs-2';
import numeral from 'numeral';

const options = {
    legend: {
        display: false,

    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
};

const buildChartData = (data, caseType = "cases") => {
    const chartData = [];
    const dataArray = Object.entries(data[caseType]);
    let lastDataPoint;

    for (let [date, cases] of dataArray) {
        if (lastDataPoint) {
            let newDataPoint = {
                x: date,
                y: cases - lastDataPoint,
            };
            chartData.push(newDataPoint);
        }
        lastDataPoint = cases;
    }
    return chartData;
};

function LineGraph({caseType = 'cases', ...props}) {
    const [data, setdata] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then(response => response.json())
            .then(data => {
                let chartData = buildChartData(data, caseType);
                setdata(chartData);
            })
        }
        fetchData();
    }, [caseType])

    return (
        <div className={props.className}>
            {data?.length > 0 && (
                <Line data={{
                    datasets: [
                        {
                            data: data,
                            backgroundColor: "rgba(204, 16, 52, 0.5)",
                            borderColor: '#CC1034',
                            borderWidth: 2,
                            pointHitRadius: 3,
                            pointHoverBackgroundColor: 'rgba(204, 16, 52, 1)',
                            pointHoverBorderColor: 'rgba(204, 16, 52, 1)'
                        }
                    ]
                }}
                options={options} />
            )}
        </div>
    )
}

export default LineGraph
