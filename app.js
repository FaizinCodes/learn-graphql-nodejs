const express = require('express');
const app = express();
const {graphqlHTTP} = require('express-graphql')
const {GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLSchema} = require('graphql');

const dataSeed = [
    {id: 1, language: 'Python', loved: true},
    {id: 2, language: 'Javascript', loved: true},
    {id: 3, language: 'Golang', loved: true},
]

const languageType = new GraphQLObjectType({
    name: "language",
    description: "proggramming langguage",
    fields: {
        id: {
            type: GraphQLInt
        },
        language: {
            type: GraphQLString
        },
        loved: {
            type: GraphQLBoolean
        }
    }
})

const rootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    description: 'This is the query',
    fields: {
        languages: {
            type: new GraphQLList(languageType),
            resolve: () => dataSeed
        },
        language: {
            type: languageType,
            args: {
                id: {type:GraphQLInt}
            },
            resolve: (_,{id}) => dataSeed.find(language => language.id === id)
        }
    }
})

const rootMutation = new GraphQLObjectType({
    name: 'RootMutation',
    description: 'This is the rootmutation',
    fields: {
        language: {
            type: languageType,
            args: {
                lang: {type:GraphQLString},
                loved: {type:GraphQLBoolean}
            },
            resolve: (_,{lang, loved}) => {
                const newLanguage = {id: dataSeed.length + 1, language: lang, loved: loved};
                dataSeed.push(newLanguage);
                return newLanguage
            } 
        }
    }
})

const schema = new GraphQLSchema({query:rootQuery, mutation:rootMutation})

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

const PORT = 4123

app.listen(PORT, () => {
    console.log(`Server connect on port: ${PORT}`);
})