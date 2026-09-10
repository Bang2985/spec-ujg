---
title: "Guiding and Evaluating Generative Software with User Journey Semantics: A Cross-Model Case Study"
summary: An exploratory case study testing whether one explicit UJG journey can guide different generative AI models and provide a shared semantic reference for evaluating their implementations.
teaser: This case study explores whether the same explicit User Journey Graph semantics can guide different generative AI models toward an intended interaction scope and subsequently provide a common semantic reference for evaluating the resulting implementations.
tags:
  - Generative Software
  - Evaluation
  - Journey Semantics
  - Non-normative
---

> **Exploratory case study - non-normative**
>
> This page is not part of the normative UJG specification. It is structured so experimental results can be added incrementally without changing the document shape.

| Field | Value |
| ----- | ----- |
| Status | Running |
| Last updated | TBD |
| Case study version | TBD |
| UJG version | TBD |
| Experiment repository | TBD |

## 1. Motivation

User Journey Graph aims to provide a shared semantic source of truth for intended user journeys across product, design, engineering, testing, and related disciplines.

UJG defines interaction intent independently from any single implementation, interface toolkit, analytics pipeline, or generation system. This makes generative software development a useful test case: different AI systems may materialize the same product intent differently, while still being expected to preserve the same user-facing journey semantics.

The central experiment is:

> If several generative models receive the same intended journey, can UJG preserve a common interaction scope across those implementations and later provide a shared reference for evaluating them?

This case study does not expect different models to produce identical interfaces. The hypothesis is that different materializations can still preserve the same intended journey semantics.
