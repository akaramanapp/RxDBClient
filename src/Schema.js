const todoSchema = {
    version: 0,
    title: 'todo schema',
    description: 'Todo List',
    type: 'object',
    properties: {
        description: {
            type: 'string',
            primary: true
        },
        status: {
            type: 'string',
        },
    },
    required: ['description'],
};

export default todoSchema;