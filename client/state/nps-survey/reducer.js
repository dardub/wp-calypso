/** @format */

/**
 * Internal dependencies
 */

import {
	NPS_SURVEY_SET_ELIGIBILITY,
	NPS_SURVEY_MARK_SHOWN_THIS_SESSION,
	NPS_SURVEY_SUBMIT_REQUESTING,
	NPS_SURVEY_SUBMIT_REQUEST_FAILURE,
	NPS_SURVEY_SUBMIT_REQUEST_SUCCESS,
	NPS_SURVEY_SUBMIT_WITH_NO_SCORE_REQUESTING,
	NPS_SURVEY_SUBMIT_WITH_NO_SCORE_REQUEST_FAILURE,
	NPS_SURVEY_SUBMIT_WITH_NO_SCORE_REQUEST_SUCCESS,
	NPS_SURVEY_SEND_FEEDBACK_REQUESTING,
	NPS_SURVEY_SEND_FEEDBACK_REQUEST_FAILTURE,
	NPS_SURVEY_SEND_FEEDBACK_REQUEST_SUCCESS,
} from 'state/action-types';
import { combineReducers, createReducer } from 'state/utils';
import { NOT_SUBMITTED, SUBMITTING, SUBMIT_FAILURE, SUBMITTED } from './constants';

export const isSessionEligible = createReducer( false, {
	[ NPS_SURVEY_SET_ELIGIBILITY ]: ( state, action ) => action.isSessionPicked,
} );

export const wasShownThisSession = createReducer( false, {
	[ NPS_SURVEY_MARK_SHOWN_THIS_SESSION ]: () => true,
} );

export const surveyState = createReducer( NOT_SUBMITTED, {
	[ NPS_SURVEY_SUBMIT_REQUESTING ]: () => SUBMITTING,
	[ NPS_SURVEY_SUBMIT_REQUEST_FAILURE ]: () => SUBMIT_FAILURE,
	[ NPS_SURVEY_SUBMIT_REQUEST_SUCCESS ]: () => SUBMITTED,
	[ NPS_SURVEY_SUBMIT_WITH_NO_SCORE_REQUESTING ]: () => SUBMITTING,
	[ NPS_SURVEY_SUBMIT_WITH_NO_SCORE_REQUEST_FAILURE ]: () => SUBMIT_FAILURE,
	[ NPS_SURVEY_SUBMIT_WITH_NO_SCORE_REQUEST_SUCCESS ]: () => SUBMITTED,
	[ NPS_SURVEY_SEND_FEEDBACK_REQUESTING ]: () => SUBMITTING,
	[ NPS_SURVEY_SEND_FEEDBACK_REQUEST_FAILTURE ]: () => SUBMIT_FAILURE,
	[ NPS_SURVEY_SEND_FEEDBACK_REQUEST_SUCCESS ]: () => SUBMITTED,
} );

export const surveyName = createReducer( null, {
	[ NPS_SURVEY_SUBMIT_REQUESTING ]: ( state, action ) => {
		return action.surveyName;
	},
	[ NPS_SURVEY_SUBMIT_WITH_NO_SCORE_REQUESTING ]: ( state, action ) => {
		return action.surveyName;
	},
	[ NPS_SURVEY_SEND_FEEDBACK_REQUESTING ]: ( state, action ) => {
		return action.surveyName;
	},
} );

export const score = createReducer( null, {
	[ NPS_SURVEY_SUBMIT_REQUESTING ]: ( state, action ) => {
		return action.score;
	},
} );

export const feedback = createReducer( null, {
	[ NPS_SURVEY_SEND_FEEDBACK_REQUESTING ]: ( state, action ) => {
		return action.feedback;
	},
} );

export default combineReducers( {
	isSessionEligible,
	wasShownThisSession,
	surveyState,
	surveyName,
	score,
	feedback,
} );
