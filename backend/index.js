const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
let world = require("./world")
const fs = require('fs');

async function readUserWorld(user) {
    try {
        const data = await fs.promises.readFile("../userworlds/" + user + "-world.json");
        return JSON.parse(data);
    }
    catch(error) {
        console.log("Il y a eu une erreur dans le fichier : " + user+"-world.json" + error);
        return world;
    }
}

// Construct a schema, using GraphQL schema language
const typeDefs = require("./schema");
// Provide resolver functions for your schema fields
const resolvers = require("./resolvers");
const {saveWorld} = require("./resolvers");
const server = new ApolloServer({
    typeDefs, resolvers,
    context: async ({ req }) => ({
        world: await readUserWorld(req.headers["x-user"]),
        user: req.headers["x-user"]
    })
})
const app = express();
app.use(express.static('public'));
server.start().then( res => {
    server.applyMiddleware({app});
    app.listen({port: 4000}, () =>
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    );
})