import { Login, Register } from './components/auth.swagger';
import { getProperty, postProperty } from './components/property.swagger';
import { getRating, postRating } from './components/rating.swagger';
import { schemas } from './components/schemas.swagger';
export const swaggerDocument = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'ZroBank Challenger API Document',
    description: 'ZroBank challenger',
    termsOfService: '',
    contact: {
      name: 'Lucas wiix',
      email: 'lucasrocha.wiix@gmail.com',
      url: 'https://github.com/lucaswiix',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1',
      description: 'Local Server',
    },
  ],
  components: {
    schemas,
    securitySchemes: {
      headerToken: {
        type: 'apiKey',
        in: 'header',
        name: 'x-auth-token',
      },
    },
  },
  tags: [
    {
      name: 'Authenticate',
      description: 'Register and login customer to the zrobank application.',
    },
    {
      name: 'Property',
      description: 'Insert and find all properties.',
    },
    {
      name: 'Rating',
      description:
        'Insert rating into property and find all rating by property.',
    },
  ],
  paths: {
    '/auth/register': {
      post: Register,
    },
    '/auth/login': {
      post: Login,
    },
    '/properties': {
      get: getProperty,
      post: postProperty,
    },
    '/properties/{key}/ratings': {
      parameters: [
        {
          name: 'key',
          in: 'path',
          required: true,
          description: 'KEY of the property that we want to match',
          type: 'string',
        },
      ],
      get: getRating,
      post: postRating,
    },
  },
};
