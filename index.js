const { ApolloServer } = require("apollo-server");
// const {PubSub } = require("graphql-subscriptions")
const gql = require("graphql-tag");
const mongoose = require("mongoose");
const { MONGODB } = require("./config");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/index");

// const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

mongoose.connect(MONGODB).then(() => {
  console.log("Mongodb connected");
});

server.listen(5000, () => {
  console.log("Listening...");
});
