/** @format */

/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import closest from 'component-closest';
import Gridicon from 'gridicons';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import { recordGoogleEvent } from 'state/analytics/actions';
import {
	setApp,
	setNewest,
	setMonth,
	setBefore,
} from 'state/billing-transactions/transaction-filters/actions';
import {
	getBillingTransactionFilters,
	getBillingTransactionAppFilterValues,
	getBillingTransactionDateFilterValues,
} from 'state/selectors';

class TransactionsHeader extends React.Component {
	state = {
		activePopover: '',
		searchValue: '',
	};

	preventEnterKeySubmission = event => {
		event.preventDefault();
	};

	componentWillMount() {
		document.body.addEventListener( 'click', this.closePopoverIfClickedOutside );
	}

	componentWillUnmount() {
		document.body.removeEventListener( 'click', this.closePopoverIfClickedOutside );
	}

	recordClickEvent = action => {
		this.props.recordGoogleEvent( 'Me', 'Clicked on ' + action );
	};

	getDatePopoverItemClickHandler( analyticsEvent, date ) {
		return () => {
			this.recordClickEvent( 'Date Popover Item: ' + analyticsEvent );
			const { transactionType } = this.props;
			if ( date.newest ) {
				this.props.setNewest( transactionType );
			} else if ( date.month ) {
				this.props.setMonth( transactionType, date.month );
			} else {
				this.props.setBefore( transactionType, date.before );
			}
			this.setState( { activePopover: '' } );
		};
	}

	getAppPopoverItemClickHandler( analyticsEvent, app ) {
		return () => {
			this.recordClickEvent( 'App Popover Item: ' + analyticsEvent );
			this.props.setApp( this.props.transactionType, app );
			this.setState( { activePopover: '' } );
		};
	}

	handleDatePopoverLinkClick = () => {
		this.recordClickEvent( 'Toggle Date Popover in Billing History' );
		this.togglePopover( 'date' );
	};

	handleAppsPopoverLinkClick = () => {
		this.recordClickEvent( 'Toggle Apps Popover in Billing History' );
		this.togglePopover( 'apps' );
	};

	closePopoverIfClickedOutside = event => {
		if ( closest( event.target, 'thead' ) ) {
			return;
		}

		this.setState( { activePopover: '' } );
	};

	render() {
		return (
			<thead>
				<tr className="billing-history__header-row">
					<th className="billing-history__date billing-history__header-column">
						{ this.renderDatePopover() }
					</th>
					<th className="billing-history__trans-app billing-history__header-column">
						{ this.renderAppsPopover() }
					</th>
					<th className="billing-history__search-field billing-history__header-column" />
				</tr>
			</thead>
		);
	}

	renderDatePopover() {
		const { dateFilters } = this.props,
			isVisible = 'date' === this.state.activePopover,
			classes = classNames( {
				'filter-popover': true,
				'is-popped': isVisible,
			} ),
			monthPickers = dateFilters.map( function( filterMeta, index ) {
				let analyticsEvent = 'Current Month';
				if ( 1 === index ) {
					analyticsEvent = '1 Month Before';
				} else if ( 1 < index ) {
					analyticsEvent = index + ' Months Before';
				}

				return this.renderDatePicker(
					index,
					filterMeta.title,
					filterMeta.value,
					filterMeta.count,
					analyticsEvent
				);
			}, this );

		return (
			<div className={ classes }>
				<strong
					className="filter-popover-toggle date-toggle"
					onClick={ this.handleDatePopoverLinkClick }
				>
					{ this.props.translate( 'Date' ) }
					<Gridicon icon="chevron-down" size={ 18 } />
				</strong>
				<div className="filter-popover-content datepicker">
					<div className="overflow">
						<table>
							<thead>
								<tr>
									<th colSpan="2">{ this.props.translate( 'Recent Transactions' ) }</th>
								</tr>
							</thead>
							<tbody>
								{ this.renderDatePicker(
									'newest',
									this.props.translate( 'Newest' ),
									{
										newest: true,
									},
									''
								) }
							</tbody>
							<thead>
								<tr>
									<th>{ this.props.translate( 'By Month' ) }</th>
									<th className="billing-history__transactions-header-count">
										{ this.props.translate( 'Transactions' ) }
									</th>
								</tr>
							</thead>
							<tbody>{ monthPickers }</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	}

	togglePopover( name ) {
		let activePopover;
		if ( this.state.activePopover === name ) {
			activePopover = '';
		} else {
			activePopover = name;
		}

		this.setState( { activePopover: activePopover } );
	}

	renderDatePicker( titleKey, titleTranslated, date, count, analyticsEvent ) {
		const currentDate = this.props.filter.date || {};
		let isSelected;

		if ( date.newest && currentDate.newest ) {
			isSelected = true;
		} else if ( date.month && currentDate.month ) {
			isSelected = date.month === currentDate.month;
		} else if ( date.before ) {
			isSelected = Boolean( currentDate.before );
		} else {
			isSelected = false;
		}

		const classes = classNames( {
			'transactions-header__date-picker': true,
			selected: isSelected,
		} );

		analyticsEvent = 'undefined' === typeof analyticsEvent ? titleKey : analyticsEvent;

		return (
			<tr
				key={ titleKey }
				className={ classes }
				onClick={ this.getDatePopoverItemClickHandler( analyticsEvent, date ) }
			>
				<td className="descriptor">{ titleTranslated }</td>
				<td className="billing-history__transactions-header-count">{ count }</td>
			</tr>
		);
	}

	renderAppsPopover() {
		const isVisible = 'apps' === this.state.activePopover;
		const classes = classNames( {
			'filter-popover': true,
			'is-popped': isVisible,
		} );
		const appPickers = this.props.appFilters.map( function( filterMeta ) {
			return this.renderAppPicker(
				filterMeta.title,
				filterMeta.value,
				filterMeta.count,
				'Specific App'
			);
		}, this );

		return (
			<div className={ classes }>
				<strong
					className="filter-popover-toggle app-toggle"
					onClick={ this.handleAppsPopoverLinkClick }
				>
					{ this.props.translate( 'All Apps' ) }
					<Gridicon icon="chevron-down" size={ 18 } />
				</strong>
				<div className="filter-popover-content app-list">
					<table>
						<thead>
							<tr>
								<th>{ this.props.translate( 'App Name' ) }</th>
								<th>{ this.props.translate( 'Transactions' ) }</th>
							</tr>
						</thead>
						<tbody>
							{ this.renderAppPicker( this.props.translate( 'All Apps' ), 'all', '' ) }
							{ appPickers }
						</tbody>
					</table>
				</div>
			</div>
		);
	}

	renderAppPicker( title, app, count, analyticsEvent ) {
		const classes = classNames( {
			'app-picker': true,
			selected: app === this.props.filter.app,
		} );

		return (
			<tr
				key={ app }
				className={ classes }
				onClick={ this.getAppPopoverItemClickHandler( analyticsEvent, app ) }
			>
				<td className="descriptor">{ title }</td>
				<td className="billing-history__transactions-header-count">{ count }</td>
			</tr>
		);
	}
}

TransactionsHeader.propTypes = {
	transactionType: PropTypes.string.isRequired,
};

export default connect(
	( state, { transactionType } ) => ( {
		filter: getBillingTransactionFilters( state, transactionType ),
		appFilters: getBillingTransactionAppFilterValues( state, transactionType ),
		dateFilters: getBillingTransactionDateFilterValues( state, transactionType ),
	} ),
	{
		recordGoogleEvent,
		setApp,
		setNewest,
		setMonth,
		setBefore,
	}
)( localize( TransactionsHeader ) );
