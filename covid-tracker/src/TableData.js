import React, {useState} from 'react';
import numeral from 'numeral';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableSortLabel from '@material-ui/core/TableSortLabel';

// Styling
const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      minHeight: '500px'
    },
    table: {
        minWidth: 650,
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    container: {
      maxHeight: 500,
    },
    cell: {
      minWidth: 100
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    }
}));

function createData(name, cases, deaths, recorvered, casesPerOneMil) {
    return { name, cases, deaths, recorvered, casesPerOneMil };
}

// -------------------Sorting--------------------- //
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
// ------------------------------------------------ //

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const headCells = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'cases', numeric: true, disablePadding: false, label: 'Cases' },
  { id: 'deaths', numeric: true, disablePadding: false, label: 'Deaths' },
  { id: 'recovered', numeric: true, disablePadding: false, label: 'Recovered' },
  { id: 'casesPerOneMillion', numeric: true, disablePadding: false, label: 'Cases/1M Pop' },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
      <TableCell>#</TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function TableData({ countries }) {
    const classes = useStyles();
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('cases');

    const rows = countries.map(country => createData(country.country, country.cases, country.deaths, country.recovered, country.casesPerOneMillion))

    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };

    return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer className={classes.container}>
          <Table className={classes.table} stickyHeader aria-label="Data Table">
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .map((row, index) => {
                  return (
                    <StyledTableRow hover key={row.name}>
                      <TableCell align="left" style={{width: '20px'}}>{index + 1}</TableCell>
                      <TableCell scope="row" className={classes.cell}>
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{numeral(row.cases).format('0,0')}</TableCell>
                      <TableCell align="right">{numeral(row.deaths).format('0,0')}</TableCell>
                      <TableCell align="right">{numeral(row.recorvered).format('0,0')}</TableCell>
                      <TableCell align="right">{numeral(row.casesPerOneMil).format('0,0')}</TableCell>
                    </StyledTableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
    );
}

export default TableData
