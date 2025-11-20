import { gql } from 'apollo-server';

export const typeDefs = gql`
  enum QuestionType {
    TEXT
    MULTIPLE_CHOICE
    CHECKBOXES
    DATE
  }

  type Form {
    id: ID!
    title: String!
    description: String
    questions: [Question!]!
  }

  type Question {
    id: ID!
    text: String!
    type: QuestionType!
    options: [String!]
    isRequired: Boolean!
    correctAnswer: [String!]
  }

  type Response {
    id: ID!
    formId: ID!
    answers: [Answer!]!
  }

  type Answer {
    questionId: ID!
    value: [String!]!
  }

  input QuestionInput {
    text: String!
    type: QuestionType!
    options: [String!]
    isRequired: Boolean!
    correctAnswer: [String!]
  }

  input AnswerInput {
    questionId: ID!
    value: [String!]!
  }

  type Query {
    forms: [Form!]!
    form(id: ID!): Form
    responses(formId: ID!): [Response!]!
  }

  type Mutation {
    createForm(title: String!, description: String, questions: [QuestionInput!]!): Form!
    submitResponse(formId: ID!, answers: [AnswerInput!]!): Response!
  }
`;