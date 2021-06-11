import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

const typeDefs = gql`
  type Mission {
    id: ID!
    crew: [Astronaut]
    designation: String!
    startDate: String
    endDate: String
    vehicle: Vehicle!
  }

  extend type Astronaut @key(fields: "id") {
    id: ID! @external
    missions: [Mission]
  }

  extend type Vehicle @key(fields: "id") {
    id: ID! @external
  }

  extend type Query {
    mission(id: ID!): Mission
    missions: [Mission]
  }
`;

const server = new ApolloServer({
  schema: buildFederatedSchema({ typeDefs }),
});

server.listen(4001);
