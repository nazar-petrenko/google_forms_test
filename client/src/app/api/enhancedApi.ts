import { api } from './generatedApi'; 

export const enhancedApi = api.enhanceEndpoints({
  addTagTypes: ['Form', 'Response'],
  endpoints: {
    GetForms: {
      providesTags: (result) => 
        result?.forms
          ? [
              ...result.forms.map(({ id }) => ({ type: 'Form' as const, id })),
              { type: 'Form', id: 'LIST' },
            ]
          : [{ type: 'Form', id: 'LIST' }],
    },
    GetFormById: {
      providesTags: (result, error, arg) => [{ type: 'Form', id: arg.id }],
    },
    GetResponses: {
      providesTags: (result, error, arg) => [{ type: 'Response', id: arg.formId }],
    },
    CreateForm: {
      invalidatesTags: [{ type: 'Form', id: 'LIST' }],
    },
    SubmitResponse: {
      invalidatesTags: (result, error, arg) => [{ type: 'Response', id: arg.formId }],
    },
  },
});

export const {
  useGetFormsQuery,
  useGetFormByIdQuery,
  useGetResponsesQuery,
  useCreateFormMutation,
  useSubmitResponseMutation,
} = enhancedApi;