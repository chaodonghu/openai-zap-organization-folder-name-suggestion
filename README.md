# Zap Organization/Folder Name Suggestion using OpenAI

This is project based off a sandbox to experiment with AI-powered search for the 2023 Q2 Hackweek.

An application that enables categorization of Zaps in Zapier by using OpenAI's embedding API to analyze Zap titles, descriptions, and ZDL steps. Clusters Zaps using k-means and suggests relevant folder names for better organization. Built with Next.js and deployed on Vercel, the app allows users to define the number of desired categories for their Zaps, improving workflow management through AI-driven suggestions.

## Problem(s)

I worked on the manage team at Zapier and a big problem we dealt with was Zap folders! Many group zaps into folders by workflow, so related Zaps are next to each other. What if we could look at the ZDL & titles of all the zaps group them by similarity and summarize what workflow these zaps target by suggesting a folder name suggestion for the grouping?

Based on a user input of how many folders or categories they want their zaps to be grouped into. We can leverage AI to look into the relationships for an account’s zaps, via intrinsic properties of their title, description and ZDL steps, and allow AI to form logical relationships between zaps for grouping.

## Solution

> The concept of Embeddings can be abstract, but suffice to say an embedding is an information dense representation of the semantic meaning of a piece of text.

The OpenAI documentation states that embeddings are commonly used for [clustering and recommendations](https://platform.openai.com/docs/guides/embeddings/what-are-embeddings) which fits the main purpose of what I was trying to achieve. Clustering can be used to discover valuable, hidden groups of semantically similar sentences within bodies of data. The goal for me this hackathon was to explore these concepts and thankfully OpenAI provides an example of [clustering utilizing food review embeddings](https://github.com/openai/openai-cookbook/blob/main/examples/Clustering.ipynb) done in python which I tried to replicate 

### Step 1: Fetch zaps and embed them

The first step was to fetch all the zaps for the account and create an embedding for each zap utilizing the [OpenAI embedding API endpoint](https://platform.openai.com/docs/guides/embeddings/what-are-embeddings). In the code I’ve limited # of zaps fetched to 500.

![](https://cdn.zappy.app/cc003154b44c7883c311ac1596d63d46.png)

Each embedding returned back is in [1536 dimensions](https://platform.openai.com/docs/guides/embeddings/second-generation-models) by default. I would have liked to store these embeddings into a vector database like pinecone but didn’t have time to implement the means of indexing then retrieving them.

### Step 2: Convert dimensionality

To visualize the embeddings in a 2D plot I had to convert each 1536 dimension vector into a 2 dimension vector. Following this [guide](https://github.com/openai/openai-cookbook/blob/main/examples/Visualizing_embeddings_in_2D.ipynb), I utilized t-SNE decomposition and a open source [tsne-js package](https://github.com/scienceai/tsne-js) to reduce this dimensionality.

_1536 Dimensions_

![](https://cdn.zappy.app/301ce6c9dbbadcd7c9e4785af5579e7d.png)

_2 Dimensions_

![](https://cdn.zappy.app/195ebd0357af3bcb6f0ed195382fea57.png)

### Step 3: Cluster 

I then had figure out how to cluster the data into groups. I utilized k-means clustering which is a algorithm that allows data to be grouped with varying granularity and sizes to discover the categories of groups in the unlabeled dataset on its own without the need for any training ([source](https://www.javatpoint.com/k-means-clustering-algorithm-in-machine-learning#:~:text=K%2DMeans%20Clustering%20is%20an%20Unsupervised%20Learning%20algorithm%2C%20which%20groups,three%20clusters%2C%20and%20so%20on.)). The "K" in k-means refers to the the number value we want to divide the dataset into (in this case the “# of categories”). I borrowed the code written in this [article](https://medium.com/geekculture/implementing-k-means-clustering-from-scratch-in-javascript-13d71fbcb31e) for implementing k-means clustering from scratch in javascript.

The k-means algorithm returned back a data structure containing an array of clusters (which equate to k/# of categories) with each cluster consisting of the points that make up that cluster and a 2-d coordinate of the centroid (mean coordinate of that cluster)

![](https://cdn.zappy.app/90bfe79e0b5764ddaf09af290a33d77d.png)

With these coordinates we can then plot it to visualize the clusters

![](https://cdn.zappy.app/8d3b82ebd8fc957bc764bfa580a9e022.png)

Each red point is a 2-d coordinate of the zap embedding and each green point is the mean of that cluster, in this case I passed in k=5 and 5 clusters are visualized in space

### Step 4: Ask OpenAI to create a recommendation on how to name each cluster

For each cluster/grouping of zaps we then give OpenAI the zap title, zap description and zdl steps for each zap with the prompt 

> You are a Zapier expert. Use this array of zaps which have been group using the kMeans algorithm and each zap consisting of a title, description and ZDL steps and come up with a folder title to summarize each group of zaps. Each folder title should ideally be less than 100 words.

_Groupings_

![](https://cdn.zappy.app/28a36bb749ec48d5cb981b386b3bdd7b.png)

The result is groups of zaps organized by embedding  along with a suggested folder name for each grouping!

![](https://cdn.zappy.app/157e79806e22e632d9ee623b9e05fb06.png)

![](https://cdn.zappy.app/6e96888f1de40bc4ea13516f97d1dc9e.png)

![](https://cdn.zappy.app/6c4a1140269f55e14d3e14617de3d752.png)

## Lessons Learned

* It helped to understand the similarities between the embeddings by visualizing the clusters so I spent a good chunk of time trying to understand how to convert the dimensionality of the embeddings from 1536 to 2 in order to plot the embeddings. I still don’t fully understand how the t-SNE algorithm works but the OpenAI cookbook recommends it
* k-means algorithm was another concept that I used in this project but don’t fully grasp how it works, it provided the ability to implement clustering/group the embeddings but I would like to explore more into how the algorithm compares values
* I would have liked to play around with indexing and retrieving the embeddings from a vector database such as pinecone. When the dataset becomes extremely large (which I haven’t tested with) I predict that the in-memory storage of embeddings and zaps that I played around will probably timeout
* The documentation on OpenAI is fairly new so trying to translate and follow a guide written in python to javascript was difficult but fun to troubleshoot 

## Recommendation / Status

This project is very bare bones (the UI/UX needs alot more work :sweat_smile:) but it does provide a proof of concept of what AI can do in terms of categorizing a large dataset and once given a prompt it has the ability to synthesize a name for each grouping. This work could provide a good base to work off in terms of giving folder name suggestions for users that have a bunch of zaps in their home folders that could benefit from being categorized into separate subfolders. :thinking:

## Getting Started

```javascript
1. yarn // install all of the dependencies
2. cp .env.example .env
3. // update the .env file to include all env vars
4. yarn dev
5. // navigate to http://localhost:3000 for a sandbox project landing page
```

### Sandboxes

**Next Search**
This is a fullstack NextJS implementation of Zap search using OpenAI embeddings and Pinecone.

## Tech Stack

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [openai](https://platform.openai.com/docs/api-reference)
- [pinecone](https://www.pinecone.io/)

### Auth

Set up with NextAuth as a Zapier Oauth app and shares auth with https://zapier-staging.com. If you are logged in on zapier-staging then that session will be shared in local development here and in Vercel preview environments for merge requests.
