import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { getZaps } from "../../../server/next-search/zapier";
import { generateZapEmbeddings } from "../../../server/next-search/openai";
import { askOpenAiToSuggestTitle } from "../../../server/folder-suggestion/openai";
// @ts-ignore
import TSNE from "tsne-js";
import kmeans from "./kmeans";
import type { ClusterPoint, Groupings, Zap } from "./types";

export default async function categorizeZaps(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = await getToken({ req });
  if (!token) {
    return res.status(401).json({ error: "No token present" });
  }

  const accountId = token.current_account_id;

  try {
    // Fetch all zaps for the account
    const zaps = await getZaps({
      zapierSession: token.zapier_internal,
      accountId,
      limit: 500, // can bump this up if needed but it will be slow
    });

    console.log(`✅ Fetched ${zaps.length} zaps`);

    // Embed all zaps
    const embeddings = await generateZapEmbeddings(zaps);

    console.log("✅ Generated embeddings");

    // Each embed value will be in 1536 dimensions so we need to reduce them to 2 dimensions
    const embeddingValues = embeddings.map((embed) => {
      return embed.values;
    });

    // Step 1: Reduce the 1536 dimensions to 2 utilizing t-SNE
    const model = new TSNE({
      dim: 2,
      perplexity: 30.0,
      earlyExaggeration: 4.0,
      learningRate: 100.0,
      nIter: 1000,
      metric: "euclidean",
    });

    // inputData is a nested array which can be converted into an ndarray
    // alternatively, it can be an array of coordinates (second argument should be specified as 'sparse')
    model.init({
      data: embeddingValues,
      type: "dense",
    });

    model.run();

    // `output` is unpacked ndarray (regular nested javascript array)
    const twoDimensionEmbeddings = model.getOutput();

    console.log("✅ Converted embeddings from 1536 dimensions to 2 dimensions");

    // Map two dimension embeddings to vectors
    const updatedEmbeddings = embeddings.map((vector, index) => {
      return {
        ...vector,
        metadata: {
          ...vector.metadata,
          twoDimensionEmbedding: twoDimensionEmbeddings[index],
        },
      };
    });

    // // Step 2: Find Kmeans and centroids and clusters
    const numClusters = Number(req.body.query);
    const kMeansResult = kmeans(twoDimensionEmbeddings, numClusters);

    console.log("✅ Completed kMeans algorithm to clusterize data");

    // Step 3: Get the cluster titles and feed group of titles into open ai to suggest group names
    const clusterTitles = [];

    // Get the cluster titles
    for (let i = 0; i < kMeansResult?.clusters.length; i++) {
      const clusterPoints = kMeansResult.clusters[i].points;

      // Find the titles for each group of clusters
      const titles = clusterPoints.map((point: ClusterPoint) => {
        const zapVector = updatedEmbeddings.find(
          (embed) => embed.metadata.twoDimensionEmbedding == point
        );

        return {
          title: zapVector?.metadata?.zapString,
          id: zapVector?.id,
        };
      });

      clusterTitles.push(titles);
    }

    const groupings: Groupings = [];

    await Promise.all(
      clusterTitles.map(async (group) => {
        const suggestion = await askOpenAiToSuggestTitle(
          group.map((zap: Zap) => zap.title)
        );

        groupings.push({
          folderName: suggestion,
          zapList: group.map((zap: Zap) => zap.id),
        });
      })
    );

    console.log(
      "✅ Completed title suggestion of each group of clustered zaps"
    );

    // Update the zap list with actual zap objects
    const groupingResults = groupings.map(({ folderName, zapList }) => {
      return {
        folderName,
        zapList: zapList?.map((id) => zaps.find((zap) => zap.id === id)),
      };
    });

    return res.status(200).json({
      success: true,
      centroids: kMeansResult.centroids,
      embeds: twoDimensionEmbeddings,
      groupingResults: groupingResults,
    });
  } catch (error) {
    return res.status(500).json({
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      error: `Something went wrong. ${error}. Refresh the page or "Sync with Zapier Session" and try to decrease the amount of categories requested`,
    });
  }
}
