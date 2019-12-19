Restaurant Roulette
===================

An app to determine where to eat dinner when indecision strikes

[Live Site](https://nissenbrau2719.github.io/restaurant_roulette/)
---------------------------------------------------------------------

Motivation
---------------
Anyone who has tried to make plans for where to meet for a meal with a group of indecisive people already know the frustration of the back and forth and wasted time in making this decision... what if there was an app to quickly make that decision for you?

Summary
--------
Restaurant Roulette was designed for indecisive people who don't really know what they want, but may have some qualifications for their  decision. Restaurant Roulette takes a users starting location and how far they are willing to travel as a search radius to find restaurants in a desired area, and uses a selection of price options and up to 10 different types of food to narrow down the list of results to those that fit the given criteria. If the user is willing to try anything, there is even a "Surprise Me" option.

Restaurant Roulette returns a random offering from a list of currently open restaurants found given the users' criteria, along with some basic info for that restaurant and a link to the restaurant's Yelp page for more detailed info, directions to get there, and customer reviews. 

If the resulting restaurant isn't acceptable to the user, they can choose to "re-roll" for another random restaurant from their results list. Users can also quickly re-submit a new set of food and price preferences to do another search within the same search area.


Technology Used
---------------
Restaurant Roulette is a fully client-side web app which uses the OpenCage Geocoder API to translate the user's submitted address/location into latitude/longitude coordinates, and uses the Yelp Fusion API's business search endpoint to gather the data needed to return restaurants that fit the user's desired parameters.

The app is written using

* HTML
* CSS
* JavaScript
* jQuery


