import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import './InfoBox.css';

function InfoBox({ title, cases, active, total, ...props }) {
    return (
        <div className="infoBox">
            <Card onClick={props.onClick} className={`${active && 'infoBox--selected'}`}>
                <CardContent>
                    {/* Title - Corona cases */}
                    <Typography className="infoBox__title" color="textSecondary">
                        {title}
                    </Typography>

                    {/* Title - New Cases */}
                    <h2 className="infoBox__newCases">{cases}</h2>

                    {/* Title - Total cases */}
                    <Typography className="infoBox__total" color="textSecondary">
                        {total} Total
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
}

export default InfoBox;
