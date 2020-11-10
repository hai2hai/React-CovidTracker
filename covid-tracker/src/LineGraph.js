import React, { useState, useEffect } from 'react';
import {Line} from 'react-chartjs-2';
import numeral from 'numeral';
import './LineGraph.css';
import {buildChartData} from './utils';

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

const casesTypeColors = {
    cases: {
      hex: "#497ff4",
      rgb: "rgba(151, 194, 227, 0.5)",
    },
    recovered: {
      hex: "#7dd71d",
      rgb: "rgba(125, 215, 29, 0.5)",
    },
    deaths: {
      hex: "#CC1034",
      rgb: "rgba(204, 16, 52, 0.5)",
    },
};

function LineGraph({caseType = 'cases', select = 'worldwide', type = 0, ...props}) {
    const [data, setdata] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            let url = select === 'worldwide' 
                                ? 'https://disease.sh/v3/covid-19/historical/all?lastdays=120'
                                : `https://disease.sh/v3/covid-19/historical/${select}?lastdays=120`;
            await fetch(url)
            .then(response => {
                if (response.status === 200)
                    return response.json();
            })
            .then(data => {
                if (data) {
                    let chartData = buildChartData(data, caseType, select, type);
                    setdata(chartData);
                }
            })
        }
        fetchData();
    }, [caseType, select, type])

    return (
        <div className={props.className}>
            {data?.length > 0 && (
                <Line data={{
                    datasets: [
                        {
                            data: data,
                            backgroundColor: casesTypeColors[caseType]['rgb'],
                            borderColor: casesTypeColors[caseType]['hex'],
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
