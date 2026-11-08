---
title: "Eigenvectors as a change of perspective"
description: "Finding the directions in which a transformation becomes simple."
date: "2026-11-06"
topic: "Math"
example: true
---

A matrix can rotate, stretch, shear, and combine coordinates. Eigenvectors identify the special directions along which its action is just scaling.

An eigenvector $v\ne 0$ satisfies

$$
Av=\lambda v.
$$

The vector may grow, shrink, or reverse direction, but it stays on the same line.

## Coordinates that fit the problem

If an $n\times n$ matrix has $n$ linearly independent eigenvectors, collect them as the columns of $P$. Then

$$
A=PDP^{-1},\qquad D=\operatorname{diag}(\lambda_1,\ldots,\lambda_n).
$$

Read this from right to left: move into eigenvector coordinates, scale each coordinate independently, then move back.

## Repeated transformations

This perspective makes powers of a matrix much less mysterious:

$$
A^k=PD^kP^{-1}.
$$

Repeated application of $A$ becomes repeated multiplication by the eigenvalues. Over time, directions with larger eigenvalue magnitudes can dominate, provided the starting vector has a component along them.

The useful habit is to ask: *is there a coordinate system in which this problem becomes simpler?*
