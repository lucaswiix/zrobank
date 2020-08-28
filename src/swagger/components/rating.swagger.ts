export const getRating = {
  tags: ['Rating'],
  description: 'Get rating by property',
  operationId: 'getRating',
  security: [{ headerToken: [] }],
  parameters: [
    {
      name: 'offset',
      in: 'query',
      required: false,
      description: 'Offset value to search ratings',
      type: 'number',
    },
    {
      name: 'limit',
      in: 'query',
      required: false,
      description: 'Limit of value per request',
      type: 'number',
    },
  ],
  produces: ['application/json'],
  responses: {
    '200': {
      description: 'OK',
      schema: {
        type: 'array',
        $ref: '#/components/schemas/Rating',
      },
    },
  },
};

export const postRating = {
  tags: ['Rating'],
  description: 'Insert rating into property',
  operationId: 'postRating',
  security: [{ headerToken: [] }],
  requestBody: {
    description: 'Submit rating form',
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            rating: {
              type: 'number',
              required: true,
            },
            description: {
              type: 'string',
              required: false,
            },
          },
        },
      },
    },
  },
  produces: ['application/json'],
  responses: {
    '200': {
      description: 'OK',
      schema: {
        type: 'object',
        $ref: '#/components/schemas/Rating',
      },
    },
    '400': {
      description: 'Bad Request / Invalid params',
    },
    '401': {
      description: 'Unathorized',
    },
  },
};
