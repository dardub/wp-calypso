/** @format */
/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Returns filter for the billing transactions of the given type
 *
 * @param  {Object}  state           Global state tree
 * @param  {String}  transactionType Transaction type
 * @return {Object}                 Billing transaction filters
 */
export default ( state, transactionType ) => {
	const filters = get(
		state,
		[ 'billingTransactions', 'transactionFilters', transactionType ],
		{}
	);
	return {
		app: '',
		date: { newest: true },
		page: 1,
		query: '',
		...filters,
	};
};
