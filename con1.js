



const { CosmosClient } = require("@azure/cosmos");
require('dotenv').config();

 // global object

let resultArray = [];







// Cosmos DB configuration
// const endpoint = "https://cdb-universe.documents.azure.com:443/";
// const key = 'cB0SZcfcoApRqaMUDZdLlc8Do1CvOvPOcXUeefpRFHwcMOsneFLqR6lvAQXnBynZ1a6PhURVZtboACDbXUg6Dw==';
// const databaseId = "heimdall-db";
// const containerId = "Deal-Id";

// Create a Cosmos DB client
const client = new CosmosClient({ endpoint: process.env.ENDPOINT, key: process.env.KEY });

// Connect to the database and container
async function initialize() {
  const database = await client.databases.createIfNotExists({ id: process.env.DATABASE_ID1 });
  const container = await database.database.containers.createIfNotExists({ id: process.env.CONTAINER_ID1 });
  return container.container;
}

// Read data from the container
async function queryContainer() {
  const container = await initialize();

  const querySpec = {
     query: "SELECT TOP  5 c.Art_Id FROM c",
  };
  

  try {
    const { resources: results } = await container.items.query(querySpec).fetchAll();
    console.log("Query results:", results);
     resultArray = results.flatMap(obj => obj.Art_Id);
    console.log(resultArray);
    
    console.log(typeof(resultArray));
    
  } catch (error) {
    console.error("Error querying container:", error);
  }

}

// const databaseId2 = "cdb-L1";
// const containerId2 = "AICITE-IC";

const client2 = new CosmosClient({  endpoint: process.env.ENDPOINT, key: process.env.KEY });

async function initialize2() {
  const database = await client2.databases.createIfNotExists({ id: process.env.DATABASE_ID2 });
  const container = await database.database.containers.createIfNotExists({ id: process.env.CONTAINER_ID2 });
  return container.container;
}
  async function queryContainer2() {
    const container2 = await initialize2();
    for (const i =0 ; i<resultArray.length; i++){
      console.log(resultArray[i]);
      const querySpec1 = {
        query: "SELECT * FROM c WHERE c.Art_Id = @ids",
        parameters: [
          {
            name: "@ids",
            value: resultArray[i]
          }
        ]
      };
      try {
        const { resources: newresults } = await container2.items.query(querySpec1).fetchAll();
        console.log("Query results:", newresults);
      } catch (error) {
        console.error("Error querying container:", error);
      }

      
    
    try {
      const { resources: newresults } = await container2.items.query(querySpec1).fetchAll();
      console.log("Query results:", newresults);
    } catch (error) {
      console.error("Error querying container:", error);
    }
  }
  }

  queryContainer2();
// Call the queryContainer function
queryContainer();
