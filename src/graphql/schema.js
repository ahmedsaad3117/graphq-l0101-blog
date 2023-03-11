const { buildSchema } = require("graphql");

module.exports = buildSchema(/* GraphQL */ `
  type RootQuery {
    login(data: UserAuthInput!): AuthData!
    posts(page: Int): [Post!]!
  }

  type RootMutation {
    createUser(data: CreateUserInput!): User!

    createPost(data: CreatePostInput!): Post!
  }

  input UserAuthInput {
    email: String!
    password: String!
  }

  input CreateUserInput {
    name: String!
    email: String!
    gender: Gender!
    password: String!
    age: Int!
  }
  
  input CreatePostInput {
    title: String!
    body: String!
    imageUrl: String
  }

  type User {
    id: ID! 
    name: String!
    email: String!
    gender: Gender!
    password: String!
    age: Int!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    imageUrl: String
    owner: User!  
  }

  type AuthData { 
    id: ID!
    token: String!  
    state: String!
  }
  
  type PostsData {
    totalPostsNum: Int!
    posts: [Post!]!
  }

  enum Gender {
    MALE
    FEMALE
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
