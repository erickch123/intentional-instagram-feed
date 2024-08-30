// import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerOptions = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Intentional Instagram Feed API',
      version: '2.0.0',
      description: 'API documentation for Intentional Instagram Feed'
    },
    servers: [
      {
        url: 'http://localhost:5000/'
      }
    ]
  },
  apis: ['./router/*.ts']
};

// const swaggerSpec = swaggerJSDoc(options);
