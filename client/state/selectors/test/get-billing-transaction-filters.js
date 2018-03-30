/** @format */
/**
 * External dependencies
 */
import { cloneDeep } from 'lodash';
/**
 * Internal dependencies
 */
import { getBillingTransactionFilters } from 'state/selectors';

describe( 'getBillingTransactionFilters()', () => {
	const state = {
		billingTransactions: {
			transactionFilters: {
				past: {
					app: 'test app',
					date: { newest: false, month: '2018-03-01', before: '' },
					page: 3,
					query: 'test query',
				},
			},
		},
	};

	test( 'returns transaction filters', () => {
		const output = getBillingTransactionFilters( state, 'past' );
		expect( output ).toEqual( {
			app: 'test app',
			date: { newest: false, month: '2018-03-01', before: '' },
			page: 3,
			query: 'test query',
		} );
	} );

	test( 'returns default values for non-existent filters', () => {
		const output = getBillingTransactionFilters( state, 'upcoming' );
		expect( output ).toEqual( {
			app: '',
			date: { newest: true },
			page: 1,
			query: '',
		} );
	} );

	test( 'fills missing values', () => {
		const testState = cloneDeep( state );
		testState.billingTransactions.transactionFilters.past = {
			app: 'test app',
		};
		const output = getBillingTransactionFilters( testState, 'past' );
		expect( output ).toEqual( {
			app: 'test app',
			date: { newest: true },
			page: 1,
			query: '',
		} );
	} );
} );
