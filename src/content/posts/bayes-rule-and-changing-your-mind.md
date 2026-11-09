---
title: "Bayes’ rule and changing your mind"
description: "A probability note on what evidence actually changes."
date: "2026-11-03"
topic: "Thoughts"
example: true
---

Bayes’ rule is a careful way of updating a belief after seeing evidence. For $P(E)>0$,

$$
P(H\mid E)=\frac{P(E\mid H)P(H)}{P(E)}.
$$

The denominator keeps the probabilities normalized. The numerator combines what we believed before with how compatible the evidence is with our hypothesis.

## The odds form

For two complementary hypotheses with nonzero prior probabilities and positive likelihoods, we can write

$$
\frac{P(H\mid E)}{P(\neg H\mid E)}
=\frac{P(E\mid H)}{P(E\mid\neg H)}
\cdot\frac{P(H)}{P(\neg H)}.
$$

In words: **posterior odds = likelihood ratio × prior odds**.

## A small example

Suppose a condition affects $1\%$ of a population. A test has $90\%$ sensitivity and a $5\%$ false-positive rate. A positive result gives

$$
P(H\mid +)=\frac{0.90\times0.01}{0.90\times0.01+0.05\times0.99}\approx0.154.
$$

About $15.4\%$, under these assumptions. The base rate matters because false positives can come from a much larger group.

The question to ask of evidence is not just “could this happen if my idea were true?” but also “how likely is it under the alternatives?”
