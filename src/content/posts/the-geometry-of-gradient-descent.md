---
title: "The geometry of gradient descent"
description: "A small step downhill, and an intuition for why it works."
date: "2026-11-08"
topic: "AI"
example: true
---

Gradient descent begins with a simple question: if I can only take one small step, which direction should I go?

The usual update rule is easy to memorize:

$$
\theta_{t+1} = \theta_t - \eta\nabla L(\theta_t).
$$

But the geometry makes it easier to remember *why* this is the right direction.

## A local picture

For a differentiable loss $L$, a small displacement $\delta$ gives the first-order approximation

$$
L(\theta + \delta) \approx L(\theta) + \nabla L(\theta)^\top \delta.
$$

If the step has a fixed Euclidean length, the inner product is smallest when $\delta$ points directly against the gradient. The negative gradient is therefore the direction of steepest local descent **under the Euclidean norm**. A different notion of distance changes what “steepest” means.

## The size of a step

Direction is only half the story. The learning rate $\eta$ determines how far we trust our local picture.

For $L(\theta)=\tfrac12\theta^2$, the update becomes

$$
\theta_{t+1}=(1-\eta)\theta_t.
$$

Starting away from zero, convergence requires $|1-\eta|<1$, or $0<\eta<2$. Too large a step can overshoot, even on this gentle parabola.

```python
theta = 3.0
learning_rate = 0.1

for _ in range(50):
    gradient = theta  # derivative of 0.5 * theta**2
    theta -= learning_rate * gradient
```

## A thought to keep

> An optimization algorithm is also a choice about geometry: how we measure a step determines what a good direction looks like.

That is the question I would carry into a first encounter with preconditioning or natural gradients.
