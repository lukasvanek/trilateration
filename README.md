# Trilateration

The frontend and backend are very quickly implemented, serves as proof of concept only. Using Apollo GraphQL.

The algorithm can be used in order to calculate coordinates of point X, when knowing positions of 3 other points and all 3 distances from point X.
Instead of using exact solution with equations, the algorithm is using another approach which provides best possilbe results even when input data are corrupted.

Interesting files to look at are located in: server/src/scripts/lib
