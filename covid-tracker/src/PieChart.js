import React from 'react';
import {Pie} from 'react-chartjs-2';
import './PieChart.css';

function PieChart({data}) {

    return (
        <div className='pieChart'>
            <h3>Stats ratio</h3>
            <Pie 
                data = {{
                    labels: ['Deaths', 'Recovered', 'Remaining'],
                    datasets: data
                }}
            />
        </div>
    )
}

export default PieChart;
