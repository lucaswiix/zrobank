export const schemas = {
  Customer: {
    type: 'object',
    properties: {
      key: {
        type: 'string',
      },
      email: {
        type: 'string',
      },
      name: {
        type: 'string',
      },
      password: {
        type: 'string',
      },
      latitude: {
        type: 'number',
      },
      longitude: {
        type: 'number',
      },
      created_at: {
        type: 'string',
      },
      updated_at: {
        type: 'string',
      },
    },
  },
  Property: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
      },
      latitude: {
        type: 'string',
      },
      longitude: {
        type: 'string',
      },
      created_at: {
        type: 'string',
      },
      updated_at: {
        type: 'string',
      },
    },
  },
  Rating: {
    type: 'object',
    properties: {
      rating: {
        type: 'number',
      },
      description: {
        type: 'string',
      },
      created_at: {
        type: 'string',
      },
      updated_at: {
        type: 'string',
      },
    },
  },
};
