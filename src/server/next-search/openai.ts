import { Configuration, OpenAIApi } from "openai";
import { env } from "@/env.mjs";
import type { Zap } from "@/types.js";

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

export const openai = new OpenAIApi(configuration);

// Builds a string to embed into a vector for sure.
// We could just use JSON.stringify here but it may be better to start easier and embed
// more data later.
// ---
// Current embeddings:
// - Zap ID
// - Zap Title
// - Zap Description
// - Zap Steps (app name and action)
const buildZapString = (zap: Zap) => {
  const zdl = zap.draft?.zdl || zap.currentVersion?.zdl || {};
  const steps: string = (zdl.steps || [])
    .map((step: { [key: string]: any }) => {
      return `${String(step.app)} ${String(step.action)}`;
    })
    .join(", ");
  return `${zap.title || ""}, ${zap.description || ""}, ${steps}`;
};

export async function generateZapEmbeddings(zaps: any[]) {
  const embeddings = [];

  for (let i = 0; i < zaps.length - 1; i++) {
    const zapString = buildZapString(zaps[i]);
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002", // just randomly picked this one, didn't do any research
      input: zapString,
    });

    // map these embeddings into the shape that pinecone expects
    const vector = {
      id: zaps[i].id,
      metadata: {
        name: "zap",
        zapString,
      },
      values: response.data.data[0].embedding,
    };

    console.log(
      `ℹ️ Created embedding for zap: ${String(zaps[i].id)}
      ---
      "${zapString}"
      `
    );

    embeddings.push(vector);
  }

  return embeddings;
}
