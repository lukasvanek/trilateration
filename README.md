# Trilateration

The frontend and backend are very quickly implemented, serves as proof of concept only. Using Apollo GraphQL.

The algorithm can be used in order to calculate coordinates of point X, when knowing positions of 3 other points and all 3 distances from point X.
Instead of using exact solution with equations, the algorithm is using another approach which provides best possible results even when input data are with error.
Which both adapts the algorithm for real-world scenarios and adds scalability in form of extending number of known points and distances achieving greater accuracy.

Interesting files to look at are located in: server/src/scripts/lib
