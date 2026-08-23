import { SwaggerDefinition, Options } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'FastPharma',
    version: '1.0.0',
    description: `
    Welcome to the FastPharma documentation.
  `,
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local Server',
    },
  ],
  tags: [
    {
      name: 'Auth',
      description: 'Authentication related endpoints',
    },
    {
      name: 'Common',
      description: 'Common endpoints',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

export const swaggerOptions: Options = {
  swaggerDefinition,
  apis: ['src/routes/user/*.ts', 'dist/routes/user/*.js'],
};
