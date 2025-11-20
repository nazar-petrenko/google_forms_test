import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:4000/graphql',
  documents: ['src/app/api/**/*.graphql'],

  generates: {
    'src/app/api/generatedApi.ts': {
      plugins: [
        'typescript',
        'typescript-operations', 
        'typescript-rtk-query'
      ],
      config: {
        importBaseApiFrom: './baseApi',
        exportBaseApiAs: 'api',
        exportHooks: true,
      },
    },
  },
};

export default config;