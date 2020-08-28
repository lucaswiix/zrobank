export const getProperty = {
  tags: ['Property'],
  description: 'Find all property data',
  operationId: 'getProperty',
  security: [{ headerToken: [] }],
  parameters: [
    {
      name: 'type',
      in: 'query',
      required: false,
      description:
        'Show the property by map(order by lat, long) or list(order by title desc).',
      schema: {
        type: 'string',
        enum: ['list', 'map'],
      },
    },
    {
      name: 'customer_name',
      in: 'query',
      required: false,
      description: 'Filter by customer name',
      type: 'string',
    },
    {
      name: 'customer_key',
      in: 'query',
      required: false,
      description: 'Filter by customer key',
      type: 'num',
    },
    {
      name: 'title',
      in: 'query',
      required: false,
      description: 'Filter by property title',
      type: 'string',
    },
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
        $ref: '#/components/schemas/Property',
      },
    },
  },
};

export const postProperty = {
  tags: ['Property'],
  description: 'Insert property',
  operationId: 'postProperty',
  security: [{ headerToken: [] }],
  requestBody: {
    description: 'Property form',
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
            },
            latitude: {
              type: 'number',
            },
            longitude: {
              type: 'number',
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
        $ref: '#/components/schemas/Property',
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
