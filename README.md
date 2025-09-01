# Signal RAG

![Node.js](https://img.shields.io/badge/Node.js-20+-5FA04E?logo=node.js&logoColor=white&style=flat-square)
![RAG](https://img.shields.io/badge/RAG-Retrival--Augmented%20Generation-A8A39E?logo=openai&logoColor=white&style=flat-square)
![ChromaDB](https://img.shields.io/badge/Chroma-Vector%20Database-ffde2c?logoColor=white&style=flat-square)

## Static portfolios are boring.

The RAG server provides Signal with long-term memory and context. It indexes career history, project
data, and other documents so that every response from the system can be grounded in personalized,
persistent information.

## What it does

The RAG server powers Signal’s **agentic retrieval pipeline**. It:

- Processes Markdown and JSON-based career history, FAQs, and project files
- Splits documents into semantically meaningful chunks
- Stores embeddings in **ChromaDB** for vector search
- Uses **prototype classification** to adjust retrieval parameters (broad vs narrow intent)
- Reranks results with **Cohere’s reranker API** for true semantic relevance
- Applies a **relevance cutoff** to filter noise while preserving high-quality context
- Serves a simple REST API (`/query`) for retrieval and context injection

This ensures responses aren’t generic AI text, but tied directly to my work, projects, and history.

## Architecture overview

![Signal Architecture](https://github.com/user-attachments/assets/9ae777bb-9564-4168-8e72-9ffbc743ae5c)

The RAG server acts as Signal’s memory layer, feeding relevant context into the system so responses
reflect my background.

## Tech stack

- **Runtime:** Node.js
- **Framework:** Express
- **Vector store:** ChromaDB
- **Embeddings:** OpenAI text-embedding-3-large
- **Reranker:** Cohere Rerank v3.5
- **Dev tooling:** ESLint, Prettier, Husky, and shared configs via
  [dev-config](https://www.npmjs.com/package/abruno-dev-config)

## Local development

Signal’s services can be run locally, but setup involves multiple moving parts.  
For now, the best way to explore Signal is the [live demo](https://signal.abruno.net).

Future work may include a simplified `docker-compose` flow for local development.

## Explore

- [Overview repo](https://github.com/anthonybruno/signal)
- [Backend repo](https://github.com/anthonybruno/signal-backend)
- [Frontend repo](https://github.com/anthonybruno/signal-frontend)
- [MCP repo](https://github.com/anthonybruno/signal-mcp)
- [Live demo](https://signal.abruno.net)

## Signal context

The RAG server shows how I think about **system decomposition, clarity of responsibilities, and
production grade AI pipelines**. By separating retrieval into its own service and making it
**agentic with classification, reranking, and cutoffs**, the architecture stays modular and
maintainable. This mirrors how I approach building **scalable, team friendly systems** that balance
speed, clarity, and correctness.
