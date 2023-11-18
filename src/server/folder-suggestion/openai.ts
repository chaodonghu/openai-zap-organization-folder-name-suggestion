import { Configuration, OpenAIApi } from "openai";
import { env } from "@/env.mjs";

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

export const openai = new OpenAIApi(configuration);

export const AI_PARAMS = {
  model: "text-davinci-003",
  temperature: 0.7,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
};

const formatPrompt = (titles: string[]) => {
  return `'You are a Zapier expert. Use this array of zaps which have been grouped using the kMeans algorithm and each zap consisting of a title, description and ZDL steps and come up with a folder title to summarize each group of zaps. Each folder title should ideally be less than 100 words.',\n${JSON.stringify(
    titles
  )}`;
};

export const askOpenAiToSuggestTitle = async (titles: string[]) => {
  const response = await openai.createCompletion({
    ...AI_PARAMS,
    max_tokens: 12,
    prompt: formatPrompt(titles),
  });

  const suggestedTitle =
    response.data.choices[0]?.text ??
    "Our AI overloads failed to generate a folder name suggestion. Score one point for humanity!";

  return suggestedTitle.trim();
};
