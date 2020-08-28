export const Login = {
  tags: ['Authenticate'],
  description: 'Log in to the application to obtain the JWT token',
  operationId: 'Login',
  requestBody: {
    description: 'Login form',
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
            },
            password: {
              type: 'string',
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
        properties: {
          success: {
            type: 'boolean',
          },
          token: {
            type: 'string',
            description: 'JWT token used to login on application',
          },
        },
      },
    },
    '401': {
      description: 'Invalid login',
    },
  },
};

export const Register = {
  tags: ['Authenticate'],
  description: 'Register to the application',
  operationId: 'Register',
  requestBody: {
    description: 'Register form',
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
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
    },
    '400': {
      description: 'E-mail já esta cadastrado',
    },
  },
};
