import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '300px'
    },
  }));

export default function FilterTable({target}) {
    const classes = useStyles();

    function FilterData (tdArr, text) {
        if (tdArr.length <= 0) return false;
        else {
            if (tdArr[0].innerText.toLowerCase().indexOf(text) > -1) return true;
            return FilterData(tdArr.slice(1), text);
        }
    }

    const keyUpHandler = (event) => {
        let filterText = event.target.value.toLowerCase();
        let tr = target.getElementsByTagName("tr");

        for (let i = 1; i < tr.length; i++) {
            let td = tr[i].getElementsByTagName("td");
            if (!FilterData([...td], filterText)) tr[i].style.display = "none";
            else tr[i].style.display = "";
        }
    }

    return (
        <TextField className={classes.root} id="outlined-basic" label="Data filter" variant="outlined" onKeyUp={keyUpHandler}/>
    );
}