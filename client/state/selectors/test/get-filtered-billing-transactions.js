/** @format */
/**
 * External dependencies
 */
import { moment } from 'i18n-calypso';
import { cloneDeep, slice } from 'lodash';
/**
 * Internal dependencies
 */
import { getFilteredBillingTransactions } from 'state/selectors';

describe( 'getBillingTransactionAppFilterValues()', () => {
	const PAGE_SIZE = 5;

	const state = {
		billingTransactions: {
			transactionFilters: {},
			items: {
				past: [
					{
						date: '2018-05-01T12:00:00+0000',
						service: 'WordPress.com',
						cc_name: 'name1 surname1',
						cc_type: 'mastercard',
						items: [
							{
								amount: '$3.50',
								type: 'new purchase',
								variation: 'Variation1',
							},
						],
					},
					{
						date: '2018-04-11T13:11:27+0000',
						service: 'WordPress.com',
						cc_name: 'name2',
						cc_type: 'visa',
						items: [
							{
								amount: '$5.75',
								type: 'new purchase',
								variation: 'Variation2',
							},
							{
								amount: '$8.00',
								type: 'new purchase',
								variation: 'Variation2',
							},
						],
					},
					{
						date: '2018-03-11T21:00:00+0000',
						service: 'Store Services',
						cc_name: 'name1 surname1',
						cc_type: 'visa',
						items: [
							{
								amount: '$3.50',
								type: 'new purchase',
								variation: 'Variation2',
							},
							{
								amount: '$5.00',
								type: 'new purchase',
								variation: 'Variation2',
							},
						],
					},
					{
						date: '2018-03-15T10:39:27+0000',
						service: 'Store Services',
						cc_name: 'name2',
						cc_type: 'mastercard',
						items: [
							{
								amount: '$4.86',
								type: 'new purchase',
								variation: 'Variation1',
							},
							{
								amount: '$1.23',
								type: 'new purchase',
								variation: 'Variation1',
							},
						],
					},
					{
						date: '2018-03-13T16:10:45+0000',
						service: 'WordPress.com',
						cc_name: 'name1 surname1',
						cc_type: 'visa',
						items: [
							{
								amount: '$3.50',
								type: 'new purchase',
								variation: 'Variation1',
							},
						],
					},
					{
						date: '2018-01-10T14:24:38+0000',
						service: 'WordPress.com',
						cc_name: 'name2',
						cc_type: 'mastercard',
						items: [
							{
								amount: '$4.20',
								type: 'new purchase',
								variation: 'Variation2',
							},
						],
					},
					{
						date: '2017-12-10T10:30:38+0000',
						service: 'Store Services',
						cc_name: 'name1 surname1',
						cc_type: 'visa',
						items: [
							{
								amount: '$3.75',
								type: 'new purchase',
								variation: 'Variation1',
							},
						],
					},
					{
						date: '2017-12-01T07:20:00+0000',
						service: 'Store Services',
						cc_name: 'name1 surname1',
						cc_type: 'visa',
						items: [
							{
								amount: '$9.50',
								type: 'new purchase',
								variation: 'Variation1',
							},
						],
					},
					{
						date: '2017-11-24T05:13:00+0000',
						service: 'WordPress.com',
						cc_name: 'name1 surname1',
						cc_type: 'visa',
						items: [
							{
								amount: '$8.40',
								type: 'new purchase',
								variation: 'Variation2',
							},
						],
					},
					{
						date: '2017-01-01T00:00:00+0000',
						service: 'Store Services',
						cc_name: 'name2',
						cc_type: 'mastercard',
						items: [
							{
								amount: '$2.40',
								type: 'new purchase',
								variation: 'Variation1',
							},
						],
					},
				],
			},
		},
	};

	describe( 'date filter', () => {
		test( 'returns a page from all transactions when filtering by newest', () => {
			const testState = cloneDeep( state );
			testState.billingTransactions.transactionFilters.past = {
				date: {
					newest: true,
				},
			};
			const result = getFilteredBillingTransactions( testState, 'past' );
			expect( result ).toEqual( {
				pageSize: PAGE_SIZE,
				total: 10,
				transactions: slice( state.billingTransactions.items.past, 0, PAGE_SIZE ).map(
					transaction => ( {
						...transaction,
						date: moment( transaction.date ).toDate(),
					} )
				),
			} );
		} );

		test( 'returns transactions filtered by month', () => {
			const testState = cloneDeep( state );
			testState.billingTransactions.transactionFilters.past = {
				date: {
					month: '2018-03-01',
				},
			};
			const result = getFilteredBillingTransactions( testState, 'past' );
			expect( result.total ).toEqual( 3 );
			expect( result.transactions.length ).toEqual( 3 );
			expect( result.transactions[ 0 ].date.getMonth() ).toEqual( 2 );
			expect( result.transactions[ 1 ].date.getMonth() ).toEqual( 2 );
			expect( result.transactions[ 2 ].date.getMonth() ).toEqual( 2 );
		} );

		test( 'returns transactions before the month set in the filter', () => {
			const testState = cloneDeep( state );
			testState.billingTransactions.transactionFilters.past = {
				date: {
					before: '2017-12-01',
				},
			};
			const result = getFilteredBillingTransactions( testState, 'past' );
			expect( result.total ).toEqual( 2 );
			expect( result.transactions.length ).toEqual( 2 );
			expect( result.transactions[ 0 ].date.getMonth() ).toEqual( 10 );
			expect( result.transactions[ 1 ].date.getMonth() ).toEqual( 0 );
		} );
	} );

	describe( 'app filter', () => {
		test( 'returns all transactions when the filter is empty', () => {
			const result = getFilteredBillingTransactions( state, 'past' );
			expect( result ).toEqual( {
				pageSize: PAGE_SIZE,
				total: 10,
				transactions: slice( state.billingTransactions.items.past, 0, PAGE_SIZE ).map(
					transaction => ( {
						...transaction,
						date: moment( transaction.date ).toDate(),
					} )
				),
			} );
		} );

		test( 'returns transactions filtered by app name', () => {
			const testState = cloneDeep( state );
			testState.billingTransactions.transactionFilters.past = {
				app: 'Store Services',
			};
			const result = getFilteredBillingTransactions( testState, 'past' );
			expect( result.total ).toEqual( 5 );
			expect( result.transactions.length ).toEqual( 5 );
			result.transactions.forEach( transaction => {
				expect( transaction.service ).toEqual( 'Store Services' );
			} );
		} );
	} );

	describe( 'search query', () => {
		test( 'returns all transactions when the filter is empty', () => {
			const result = getFilteredBillingTransactions( state, 'past' );
			expect( result ).toEqual( {
				pageSize: PAGE_SIZE,
				total: 10,
				transactions: slice( state.billingTransactions.items.past, 0, PAGE_SIZE ).map(
					transaction => ( {
						...transaction,
						date: moment( transaction.date ).toDate(),
					} )
				),
			} );
		} );

		test( 'query matches a field in the root transaction object', () => {
			const testState = cloneDeep( state );
			testState.billingTransactions.transactionFilters.past = {
				query: 'mastercard',
			};
			const result = getFilteredBillingTransactions( testState, 'past' );
			expect( result.total ).toEqual( 4 );
			expect( result.transactions.length ).toEqual( 4 );
			result.transactions.forEach( transaction => {
				expect( transaction.cc_type ).toEqual( 'mastercard' );
			} );
		} );

		test( 'query matches a field in the transaction items array', () => {
			const testState = cloneDeep( state );
			testState.billingTransactions.transactionFilters.past = {
				query: '$3.50',
			};
			const result = getFilteredBillingTransactions( testState, 'past' );
			expect( result.total ).toEqual( 3 );
			expect( result.transactions.length ).toEqual( 3 );
			expect( result.transactions[ 0 ].items ).toMatchObject( [ { amount: '$3.50' } ] );
			expect( result.transactions[ 1 ].items ).toMatchObject( [
				{ amount: '$3.50' },
				{ amount: '$5.00' },
			] );
			expect( result.transactions[ 2 ].items ).toMatchObject( [ { amount: '$3.50' } ] );
		} );
	} );

	describe( 'filter combinations', () => {
		test( 'date and app filters', () => {
			const testState = cloneDeep( state );
			testState.billingTransactions.transactionFilters.past = {
				date: { month: '2018-03-01' },
				app: 'Store Services',
			};
			const result = getFilteredBillingTransactions( testState, 'past' );
			expect( result.total ).toEqual( 2 );
			expect( result.transactions.length ).toEqual( 2 );
			expect( result.transactions[ 0 ].date.getMonth() ).toEqual( 2 );
			expect( result.transactions[ 0 ].service ).toEqual( 'Store Services' );
			expect( result.transactions[ 1 ].date.getMonth() ).toEqual( 2 );
			expect( result.transactions[ 1 ].service ).toEqual( 'Store Services' );
		} );

		test( 'app and query filters', () => {
			const testState = cloneDeep( state );
			testState.billingTransactions.transactionFilters.past = {
				app: 'Store Services',
				query: '$3.50',
			};
			const result = getFilteredBillingTransactions( testState, 'past' );
			expect( result.total ).toEqual( 1 );
			expect( result.transactions.length ).toEqual( 1 );
			expect( result.transactions[ 0 ].items ).toMatchObject( [
				{ amount: '$3.50' },
				{ amount: '$5.00' },
			] );
			expect( result.transactions[ 0 ].service ).toEqual( 'Store Services' );
		} );

		test( 'date and query filters', () => {
			const testState = cloneDeep( state );
			testState.billingTransactions.transactionFilters.past = {
				date: { month: '2018-05-01' },
				query: '$3.50',
			};
			const result = getFilteredBillingTransactions( testState, 'past' );
			expect( result.total ).toEqual( 1 );
			expect( result.transactions.length ).toEqual( 1 );
			expect( result.transactions[ 0 ].items ).toMatchObject( [ { amount: '$3.50' } ] );
			expect( result.transactions[ 0 ].date.getMonth() ).toEqual( 4 );
		} );

		test( 'app, date and query filters', () => {
			const testState = cloneDeep( state );
			testState.billingTransactions.transactionFilters.past = {
				date: { month: '2018-03-01' },
				query: 'visa',
				app: 'WordPress.com',
			};
			const result = getFilteredBillingTransactions( testState, 'past' );
			expect( result.total ).toEqual( 1 );
			expect( result.transactions.length ).toEqual( 1 );
			expect( result.transactions[ 0 ].cc_type ).toEqual( 'visa' );
			expect( result.transactions[ 0 ].date.getMonth() ).toEqual( 2 );
			expect( result.transactions[ 0 ].service ).toEqual( 'WordPress.com' );
		} );
	} );

	describe( 'no results', () => {
		test( 'should return all fields and an empty transactions array', () => {
			const testState = cloneDeep( state );
			testState.billingTransactions.transactionFilters.past = {
				date: { month: '2019-01-01' },
			};
			const result = getFilteredBillingTransactions( testState, 'past' );
			expect( result ).toEqual( {
				total: 0,
				pageSize: PAGE_SIZE,
				transactions: [],
			} );
		} );
	} );
} );
