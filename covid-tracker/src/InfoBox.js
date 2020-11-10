import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import './InfoBox.css';

function InfoBox({ title, cases, active, total, isRed, isGreen, isBlue = 0, ...props }) {
    return (
        <div className="infoBox">
            <Card onClick={props.onClick} 
                  className={`${active && 'infoBox--selected'} 
                              ${isGreen && 'infoBox--green'}
                              ${isRed && 'infoBox--red'}`} >
                <CardContent>
                    {/* Title - Corona cases */}
                    <Typography className="infoBox__title" color="textSecondary">
                        {title}
                    </Typography>

                    {/* Title - New Cases */}
                    <h2 className={`infoBox__newCases ${isGreen && 'infoBox__newCases--green'}
                                                      ${isRed && 'infoBox__newCases--red'}`}>
                        {cases}
                    </h2>

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
