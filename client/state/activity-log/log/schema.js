/** @format */
const activityItemSchema = {
	type: 'object',
	additionalProperties: false,
	required: [
		'activityDate',
		'activityGroup',
		'activityIcon',
		'activityId',
		'activityIsRewindable',
		'activityName',
		'activityTitle',
		'activityTs',
		'actorAvatarUrl',
		'actorName',
		'actorRole',
		'actorType',
	],
	properties: {
		activityDate: { type: 'string' },
		activityGroup: { type: 'string' },
		activityIcon: { type: 'string' },
		activityId: { type: 'string' },
		activityIsRewindable: { type: 'boolean' },
		activityName: { type: 'string' },
		activityStatus: {
			oneOf: [ { type: 'string' }, { type: 'null' } ],
		},
		activityTitle: { type: 'string' },
		activityTs: { type: 'integer' },
		actorAvatarUrl: { type: 'string' },
		actorName: { type: 'string' },
		actorRemoteId: { type: 'integer' },
		actorRole: { type: 'string' },
		actorType: { type: 'string' },
		actorWpcomId: { type: 'integer' },
		rewindId: { type: [ 'null', 'string' ] },
	},
};

export const logItemsSchema = {
	type: 'object',
	additionalProperties: false,
	properties: {
		patternProperties: {
			'd+': {
				type: 'array',
				items: {
					type: activityItemSchema,
				},
			},
		},
	},
};
