const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'User Automation Practice Site API',
    version: '1.0.0',
    description:
      'REST API for user authentication and management. All protected endpoints require a valid session cookie obtained from POST /api/login.',
  },
  servers: [{ url: '', description: 'Current host' }],
  tags: [
    { name: 'Auth', description: 'Authentication and session management' },
    { name: 'Profile', description: 'Logged-in user profile operations' },
    { name: 'Users', description: 'User CRUD (requires authentication)' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token issued by POST /api/login. Paste the token value from the login response.',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '1718000000000' },
          firstName: { type: 'string', example: 'John' },
          lastName: { type: 'string', example: 'Doe' },
          email: { type: 'string', format: 'email', example: 'john@example.com' },
          phoneNumber: { type: 'string', example: '01712345678' },
          gender: { type: 'string', enum: ['', 'Male', 'Female'], example: 'Male' },
          birthdate: { type: 'string', format: 'date', nullable: true, example: '1995-06-15' },
          district: { type: 'string', nullable: true, example: 'Dhaka' },
          bloodGroup: {
            type: 'string',
            nullable: true,
            enum: ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'],
            example: 'O+',
          },
          photo: { type: 'string', nullable: true, description: 'Base64 data URI' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/api/login': {
      post: {
        tags: ['Auth'],
        summary: 'Log in and receive a session cookie',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'john@example.com' },
                  password: { type: 'string', example: 'secret123' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful — returns JWT token in body and sets httpOnly cookie',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Logged in' },
                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                    user: {
                      type: 'object',
                      properties: {
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        email: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: 'Missing email or password', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Clear session cookie',
        responses: {
          200: {
            description: 'Logged out successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string', example: 'Logged out' } },
                },
              },
            },
          },
        },
      },
    },
    '/api/signup': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['firstName', 'lastName', 'email', 'password', 'agreement'],
                properties: {
                  firstName: { type: 'string', example: 'John' },
                  lastName: { type: 'string', example: 'Doe' },
                  email: { type: 'string', format: 'email', example: 'john@example.com' },
                  phoneNumber: { type: 'string', example: '01712345678', description: 'Bangladesh format: 01XXXXXXXXX' },
                  password: { type: 'string', example: 'secret123' },
                  gender: { type: 'string', enum: ['', 'Male', 'Female'], example: 'Male' },
                  birthdate: { type: 'string', format: 'date', example: '1995-06-15' },
                  district: { type: 'string', example: 'Dhaka' },
                  bloodGroup: { type: 'string', enum: ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'], example: 'O+' },
                  photo: { type: 'string', description: 'Base64 data URI (max 5 MB, image only)' },
                  agreement: { type: 'boolean', example: true, description: 'Must be true to register' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string', example: 'User registered successfully' } },
                },
              },
            },
          },
          400: { description: 'Missing required fields, invalid phone, or terms not accepted', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          409: { description: 'Email already registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/update-profile': {
      post: {
        tags: ['Profile'],
        summary: "Update the logged-in user's profile",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['firstName', 'lastName', 'phoneNumber', 'gender'],
                properties: {
                  firstName: { type: 'string', example: 'Jane' },
                  lastName: { type: 'string', example: 'Doe' },
                  phoneNumber: { type: 'string', example: '01812345678' },
                  gender: { type: 'string', enum: ['', 'Male', 'Female'], example: 'Female' },
                  photo: { type: 'string', description: 'Base64 data URI (optional)' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Profile updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Profile updated successfully' },
                    user: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          400: { description: 'Missing required fields', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/change-password': {
      post: {
        tags: ['Profile'],
        summary: "Change the logged-in user's password",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['currentPassword', 'newPassword'],
                properties: {
                  currentPassword: { type: 'string', example: 'oldSecret123' },
                  newPassword: { type: 'string', example: 'newSecret456', description: 'Minimum 6 characters' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Password changed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string', example: 'Password changed successfully' } },
                },
              },
            },
          },
          400: { description: 'Missing fields or new password too short', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Current password incorrect', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'List all users (paginated, searchable)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Search across firstName, lastName, email, phoneNumber' },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number (1-based)' },
          { name: 'pageSize', in: 'query', schema: { type: 'integer', default: 10 }, description: 'Items per page' },
        ],
        responses: {
          200: {
            description: 'Paginated user list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/User' } },
                    page: { type: 'integer', example: 1 },
                    pageSize: { type: 'integer', example: 10 },
                    total: { type: 'integer', example: 42 },
                    totalPages: { type: 'integer', example: 5 },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/users/{id}': {
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'User ID' },
      ],
      get: {
        tags: ['Users'],
        summary: 'Get a user by ID',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'User details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { user: { $ref: '#/components/schemas/User' } },
                },
              },
            },
          },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      put: {
        tags: ['Users'],
        summary: 'Update a user by ID',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  phoneNumber: { type: 'string' },
                  gender: { type: 'string', enum: ['', 'Male', 'Female'] },
                  birthdate: { type: 'string', format: 'date' },
                  district: { type: 'string' },
                  bloodGroup: { type: 'string', enum: ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'] },
                  photo: { type: 'string', description: 'Base64 data URI' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Updated user',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { user: { $ref: '#/components/schemas/User' } },
                },
              },
            },
          },
          400: { description: 'Email already in use by another user', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete a user by ID',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'User deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string', example: 'Deleted' } },
                },
              },
            },
          },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
  },
};

module.exports = swaggerSpec;
