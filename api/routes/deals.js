let newresults = [];
const express = require('express');
const { CosmosClient } = require("@azure/cosmos");

const router = express.Router();
require('dotenv').config()

async function initializeContainer(client, databaseId, containerId) {
  const database = await client.databases.createIfNotExists({ id: databaseId });
  const container = await database.database.containers.createIfNotExists({ id: containerId });
  return container.container;
}

async function queryContainer(container, querySpec) {
  try {
    const { resources: results } = await container.items.query(querySpec).fetchAll();
    return results;
  } catch (error) {
    console.error("Error querying container:", error);
    throw error;
  }
}

router.get('/', async (req, res, next) => {
    const client = new CosmosClient({ endpoint: process.env.ENDPOINT, key: process.env.KEY });
  
    try {
      const container = await initializeContainer(client, process.env.DATABASE_ID1, process.env.CONTAINER_ID1);
  
      const querySpec = {
        query: "SELECT TOP 20 c.Art_Id FROM c",
      };
  
      const results = await queryContainer(container, querySpec);
  
      const resultArray = results.flatMap(obj => obj.Art_Id);
      const aggregatedResults = [];  // Accumulate results here
  
      const client2 = new CosmosClient({ endpoint: process.env.ENDPOINT, key: process.env.KEY });
      const container2 = await initializeContainer(client2, process.env.DATABASE_ID2, process.env.CONTAINER_ID2);
  
      for (const artId of resultArray) {
        const querySpec1 = {
          query: "SELECT * FROM c WHERE c.Art_Id = @ids",
          parameters: [
            {
              name: "@ids",
              value: artId,
            },
          ],
        };
  
        try {
          const { resources: newResults } = await container2.items.query(querySpec1).fetchAll();
          aggregatedResults.push(...newResults);
        } catch (error) {
          console.error("Error querying container:", error);
        }
      }
  
      // Send the response after the loop
      res.json({ success: true, message: "Data fetched successfully", results: aggregatedResults });
  
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: "Data fetching failed" });
    }
  });
module.exports = router;  