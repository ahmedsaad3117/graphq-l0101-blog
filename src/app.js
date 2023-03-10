const express = require("express");
const swaggerUi = require("swagger-ui-express");
const auth = require("./middleware/auth");
const swaggerDocument = require("../swagger.json");
const { graphqlHTTP } = require("express-graphql");

require("./db/mongoose");

const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");

const cors = require("cors");

const app = express();
app.use(cors()); // create you own cors

app.use(auth);

// 2 level first one is createing whole process secondone is about index.html the roken on it or the auth file

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    formatError(err) {
      if (!err.originalError) {
        return err;
      }

      const data = err.originalError.data;
      const message = err.message || "An error occurred.";
      const code = err.originalError.code || 500;
      const state = err.originalError.code || "💥";
      return { message, status: code, state, data };
    },
  })
);

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
