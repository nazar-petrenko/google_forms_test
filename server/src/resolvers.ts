import { v4 as uuidv4 } from 'uuid';
import { forms, responses } from './db';
import { Form, Response, CreateFormArgs, SubmitResponseArgs } from './types';
import { UserInputError } from 'apollo-server';

export const resolvers = {
  Query: {
    forms: (): Form[] => forms,
    form: (_: any, { id }: { id: string }): Form | undefined => forms.find(f => f.id === id),
    responses: (_: any, { formId }: { formId: string }): Response[] =>
      responses.filter(r => r.formId === formId),
  },

  Mutation: {
    createForm: (_: any, { title, description, questions }: CreateFormArgs): Form => {
      const newForm: Form = {
        id: uuidv4(),
        title,
        description,
        questions: questions.map((q) => ({
          ...q,
          id: uuidv4(),
        })),
      };
      forms.push(newForm);
      return newForm;
    },
    submitResponse: (_: any, { formId, answers }: SubmitResponseArgs): Response => {
      const form = forms.find(f => f.id === formId);
      if (!form) {
        throw new UserInputError('Form with this ID was not found.');
      }

      form.questions.forEach(question => {
        if (question.isRequired) {
          const answerForQuestion = answers.find(a => a.questionId === question.id);
          if (!answerForQuestion || answerForQuestion.value.length === 0 || !answerForQuestion.value[0]) {
            throw new UserInputError(`A response to the required question "${question.text}" is missing.`);
          }
        }
      });

      const newResponse: Response = {
        id: uuidv4(),
        formId,
        answers,
      };
      responses.push(newResponse);
      return newResponse;
    },
  },
};