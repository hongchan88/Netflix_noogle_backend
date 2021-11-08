const { Neo4jGraphQL } = require("@neo4j/graphql");
const { gql, ApolloServer } = require("apollo-server");
const neo4j = require("neo4j-driver");
require("dotenv").config();

const typeDefs = gql`
  type Title {
    show_id: String
    Title: String

    release: Release @relationship(type: "Released_in", direction: OUT)
    director: Director @relationship(type: "Directed", direction: IN)
    country: Country @relationship(type: "Made_in", direction: OUT)
  }

  type Release {
    release_year: String
    show_id: String
    title: [Title] @relationship(type: "Released_in", direction: IN)
  }
  type Director {
    director: String
    show_id: String
    title: Title @relationship(type: "Directed", direction: OUT)
  }

  type Country {
    show_id: String
    country: String
    title: [Title] @relationship(type: "Made_in", direction: IN)
  }
`;

console.log(process.env.NEO4J_PASS, process.env.NEO4J_URI);
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS)
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

const server = new ApolloServer({
  schema: neoSchema.schema,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
