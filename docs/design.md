## Requirements

### Technical

-   Use modern web technologies
-   Should be simple to run
-   Deployment ready
-   Hand coded physics
-   Attribute third parties
-   Test coverage
-   Bundling and minification

### Functional

-   Clicking on a canvas should spawn a ball
    -   Balls should have random velocity
    -   Should bounce off the floor: until it stops ??

### Assumed requirements / nice to haves

-   Balls should be affected by a vertical downward force
-   Balls should bounce off the container walls
-   Balls should have a random color (it's nice to be able to tell them apart)
-   Most recently added balls should be displayed at the front
-   Balls should have damping so that they eventually bouncing
-   Balls should have a friction force so that they stop rolling

## Design

### Naive approach

This seems like a straightforward task, we simply need a window, and a way to display
a set of balls, adding new ones as we click on the window and the physics are rather simple.

A naive approach would be to use a simple canvas and draw the balls on it from an array of positions,
clearing the canvas with each frame and updating the positions.  
Lets just assume for a moment that the user really like to use the site and has spawned many balls.  
Very soon we'll end up doing physics calculations for each of the balls AND drawing each one on the canvas,
let alone doing depth checking of any kind.

But there are a few advantages to this approach:

-   It's simple
-   It's widely supported
-   Minimal dependencies required

However, it is overshadowed by rather large disadvantages:

-   It's not scalable
-   It's not performant

### Modern approach

A typical approach for fast graphics would be to use WebGL, it has been adopted by the overwhelming
majority of web browsers on all platforms. On top of that we can use a method called instancing to
further improve out drawing by painting all the balls in our canvas with a single draw call.

The resulting code is slightly more complex yet remains maintainable especially with the help of
libraries such as react-fiber which brings three.js to the world of react. This doesn't help us with our
physics calculations which are still performed by the not-so-parallelizable javascript.

Here are the advantages of this approach:

-   It's moderately scalable
-   It's performant
-   It's maintainable

And the disadvantages:

-   It's a bit more complex
-   It's not as supported as regular canvas (to a tiny degree)

### Hyper optimisations

We could go even further and optimise our physics calculations by using compute shaders which have
been available in modern game development for quite a while, but in order to use them we would need to
use webGPU which is only supported in very limited circumstances - not good enough for our requirement.

It is hypothetically possible to use this approach to gain optimal performance, but it comes at a
hefty price of missing compatibility and complexity in form of shaders that have to be written.

### Conclusion

We will use the modern approach, as it is the most balanced and the most suitable for our requirements.

## Not implemented

-   It was outside of scope to include UI for changing the gravity, friction and damping, etc
