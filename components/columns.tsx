import { DateTime } from "luxon";
import { Column } from "react-table";

const defaultColumns: Column[] = [
    { Header: '#', id: 'index', accessor: (_row: any, i : number) => i + 1  },
    { Header: 'Nick', accessor: 'nick' },
];

export const SeasonColumns: { [key: string]: Column[] } = {
	byWinnings: defaultColumns.concat([
		{ Header: 'Gevinst', accessor: 'winnings', Cell: props => <div className='text-right'>{props.value}</div> },
	]),
    byAvgPlace: defaultColumns.concat([
		{ Header: 'Plassiffer', accessor: 'avgPlace', Cell: props => <div className='text-right'>{props.value.toFixed(2)}</div> },
	]),
    byPoints: defaultColumns.concat([
		{ Header: 'Poeng', accessor: 'points', Cell: props => <div className='text-right'>{props.value}</div> },
	]),
    byKnockouts: defaultColumns.concat([
		{ Header: 'Knockouts', accessor: 'knockouts', Cell: props => <div className='text-right'>{props.value}</div> },
	]),
    byWinRatio: defaultColumns.concat([
		{
            Header: 'Andel',
            accessor: (_row: any) => _row.wins*100/_row.played,
            Cell: props => <div className='text-right'>{props.value.toFixed(2)}%</div>
        },
	]),
    byWinRatioTotal: defaultColumns.concat([
		{
            Header: 'Andel',
            accessor: (_row: any) => _row.wins*100/_row.numTotal,
            Cell: props => <div className='text-right'>{props.value.toFixed(2)}%</div>
        },
	]),
    byHeadsUp: defaultColumns.concat([
		{
            Header: 'Antall',
            accessor: (_row: any) => _row.headsUp*100/_row.played,
            Cell: props => <div className='text-right'>{props.value.toFixed(2)}%</div>
        },
		{
            Header: 'Vunnet',
            accessor: (_row: any) => _row.wins*100/_row.played,
            Cell: props => <div className='text-right'>{props.value.toFixed(2)}%</div>
        },
	]),
    byNumPlayed: defaultColumns.concat([
		{
            Header: 'Antall',
            accessor: (_row: any) => _row.numTotal - _row.played,
            Cell: props => <div className='text-right'>{props.value}</div>
        },
		{
            Header: 'Prosent',
            accessor: (_row: any) => (_row.numTotal - _row.played)*100/_row.numTotal,
            Cell: props => <div className='text-right'>{props.value.toFixed(2)}%</div>
        },
	]),
    byForm: defaultColumns.concat([
		{
            Header: 'Form',
            accessor: (_row: any) => _row.form.join("-"),
            Cell: props => <div className='text-right'>{props.value}</div>
        },
	]),
    byLongestYellow: defaultColumns.concat([
		{
            Header: 'Varighet',
            accessor: 'days',
            Cell: props => <div className='text-right'>{props.value} dager</div>
        },
	]),
    byMonthStats: defaultColumns.concat([
		{
            Header: 'Antall',
            accessor: 'count',
            Cell: props => <div className='text-right'>{props.value}</div>
        },
	]),
    byLastHeadsUp: defaultColumns.concat([
		{
            Header: 'Sist heads up',
            accessor: 'when',
            Cell: props => <div className='text-right'>{props.value}</div>
        },
	]),
};
