/** @format */
/**
 * Internal dependencies
 */
import { getBillingTransactionDateFilterValues } from 'state/selectors';

jest.mock( 'i18n-calypso', () => {
	const moment = require( 'moment' );
	moment.now = () => new Date( 2018, 4, 24 ); //May 24, 2018
	return {
		translate: str => str,
		moment: moment,
	};
} );

describe( 'getBillingTransactionDateFilterValues()', () => {
	const state = {
		billingTransactions: {
			items: {
				past: [
					{
						date: '2018-05-01T12:00:00+0000',
					},
					{
						date: '2018-04-11T13:11:27+0000',
					},
					{
						date: '2018-03-11T21:00:00+0000',
					},
					{
						date: '2018-03-15T10:39:27+0000',
					},
					{
						date: '2018-03-13T16:10:45+0000',
					},
					{
						date: '2018-01-10T14:24:38+0000',
					},
					{
						date: '2017-12-10T10:30:38+0000',
					},
					{
						date: '2017-12-01T07:20:00+0000',
					},
					{
						date: '2017-11-24T05:13:00+0000',
					},
					{
						date: '2017-01-01T00:00:00+0000',
					},
				],
			},
		},
	};

	test( 'returns transaction app filter values with counts', () => {
		const result = getBillingTransactionDateFilterValues( state, 'past' );
		expect( result ).toEqual( [
			{
				count: 1,
				key: '2018-05-01',
				title: 'May 2018',
				value: {
					month: '2018-05-01',
				},
			},
			{
				count: 1,
				key: '2018-04-01',
				title: 'Apr 2018',
				value: {
					month: '2018-04-01',
				},
			},
			{
				count: 3,
				key: '2018-03-01',
				title: 'Mar 2018',
				value: {
					month: '2018-03-01',
				},
			},
			{
				count: 0,
				key: '2018-02-01',
				title: 'Feb 2018',
				value: {
					month: '2018-02-01',
				},
			},
			{
				count: 1,
				key: '2018-01-01',
				title: 'Jan 2018',
				value: {
					month: '2018-01-01',
				},
			},
			{
				count: 2,
				key: '2017-12-01',
				title: 'Dec 2017',
				value: {
					month: '2017-12-01',
				},
			},
			{
				count: 2,
				key: '2017-11-01',
				title: 'Older',
				value: {
					before: '2017-11-01',
				},
			},
		] );
	} );

	test( 'returns an empty array when there are no transactions', () => {
		const result = getBillingTransactionDateFilterValues(
			{
				billingTransactions: {
					items: {},
				},
			},
			'past'
		);
		expect( result ).toEqual( [] );
	} );
} );
