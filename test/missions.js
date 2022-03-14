import { ApolloServer, gql } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/subgraph";

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
  schema: buildSubgraphSchema({ typeDefs }),
});

server.listen(4001);
