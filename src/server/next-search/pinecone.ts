import { PineconeClient } from "@pinecone-database/pinecone";
import { env } from "@/env.mjs";
import { openai } from "./openai";

const PINECONE_INDEX = "folder-name-suggestion-hackathon";

const getNamespaceName = (accountId: string | number) => {
  return `account:${accountId}`;
};

let _pinecone: PineconeClient | undefined;
/**
 * This function is used to get an instance of PineconeClient.
 * If the `_pinecone` variable is not already set, it creates a new PineconeClient instance.
 * After creating the PineconeClient instance, it initializes the client with the provided
 * environment and apiKey. The `_pinecone` variable is then cached and returned for future use.
 */
async function getPineconeClient() {
  // Check if _pinecone has been initialized
  if (!_pinecone) {
    // Create a new PineconeClient instance if it hasn't been initialized
    _pinecone = new PineconeClient();

    // Initialize the PineconeClient with the required configuration settings
    await _pinecone.init({
      environment: "us-east-1-aws", // Set the environment as US East (N. Virginia) on AWS
      apiKey: env.PINECONE_API_KEY, // Set the API key from environment variables
    });
  }

  // Return the cached _pinecone instance
  return _pinecone;
}

export const findIndex = async ({
  accountId,
}: {
  accountId: string | number;
}) => {
  // Fetch PineconeClient instance using getPineconeClient helper function
  const pinecone = await getPineconeClient();
  const index = pinecone.Index(PINECONE_INDEX);
  // Get stats about the index so we can check if the namespace exists
  const indexStats = await index
    .describeIndexStats({
      describeIndexStatsRequest: {},
    })
    .catch(console.error);

  // Check to see if there is a matching index for this accountId
  return !!indexStats?.namespaces?.[getNamespaceName(accountId)];
};

/**
 * This function is used to index embeddings for a specific account in the Pinecone service.
 * It takes an accountId and an array of embeddings as arguments, then fetches the instance of
 * PineconeClient and creates or updates the corresponding Pinecone index.
 */
export const indexEmbeddings = async ({
  accountId,
  embeddings,
}: {
  accountId: string | number;
  embeddings: any[];
}) => {
  // Fetch PineconeClient instance using getPineconeClient helper function
  const pinecone = await getPineconeClient();

  // Create or retrieve the Pinecone index using the specified PINECONE_INDEX constant
  // const index = pinecone.Index(PINECONE_INDEX);
  const index = pinecone.Index(PINECONE_INDEX);

  console.log(
    `ℹ️ Starting upsert to index embeddings in "${getNamespaceName(
      accountId
    )}" namespace`
  );

  // Perform the upsert operation on the specified accountId and provided embeddings
  await index
    .upsert({
      upsertRequest: {
        vectors: embeddings, // Include the array of embeddings for indexing
        namespace: getNamespaceName(accountId), // Convert the accountId to a string to use as the namespace
      },
    })
    .catch(console.error);

  console.log(
    `✅ Indexed embeddings in "${getNamespaceName(accountId)}" namespace`
  );

  // Return once the indexing operation is completed
  return;
};

/**
 * This function searches for relevant zaps using a query string within an account's Pinecone index.
 * It first retrieves the PineconeClient instance and the Pinecone index, then generates
 * an embedding from the query, and finally performs a search in the Pinecone index.
 */
export const searchZaps = async ({
  accountId,
  query,
}: {
  accountId: string | number;
  query: string;
}) => {
  // Fetch PineconeClient instance using getPineconeClient helper function
  const pinecone = await getPineconeClient();
  // Create or retrieve the Pinecone index using the specified PINECONE_INDEX constant
  const index = pinecone.Index(PINECONE_INDEX);

  // Generate an embedding for the input query using OpenAI's createEmbedding function
  const embedding = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: query,
  });

  // Perform the search query on Pinecone index with the generated embedding as vector
  const results = await index.query({
    queryRequest: {
      namespace: getNamespaceName(accountId), // Convert the accountId to a string to use as the namespace
      vector: embedding.data.data[0].embedding, // Use the generated embedding for query vector
      topK: 10, // Request the top 10 matched items
      includeValues: true, // Include the indexed values in the results
      includeMetadata: true, // Include the metadata of the indexed items in the results
    },
  });

  // Return the array of matches fetched from the Pinecone index
  return results.matches;
};
