---
title: "When a sequence finds its limit"
description: "Unpacking the epsilon definition, one quantifier at a time."
date: "2026-10-26"
topic: "Math"
example: true
---

The definition of convergence is short, but its order matters:

$$
a_n\to L\iff\forall\varepsilon>0,\ \exists N\in\mathbb{N},\ \forall n\ge N,\quad |a_n-L|<\varepsilon.
$$

We choose a tolerance first. Only then do we find a point beyond which **every** term stays within that tolerance.

## An example we can hold

Take $a_n=1/n$, with $n\ge1$. Given any $\varepsilon>0$, choose an integer $N>1/\varepsilon$. For every $n\ge N$,

$$
\left|\frac1n-0\right|=\frac1n\le\frac1N<\varepsilon.
$$

That proves $1/n\to0$.

## What the quantifiers say

The cutoff $N$ may depend on $\varepsilon$. A tighter tolerance can require waiting longer. It cannot depend on the later choice of $n$: a single cutoff must work for the entire tail.

The mental image is a horizontal band around the limit. However narrow we make the band, the sequence eventually enters and never leaves.
