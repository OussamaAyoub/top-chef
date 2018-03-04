# TOP CHEF

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Introduction

Each year, Michelin publish the Michelin Red Guide which awards Michelin stars to some restaurants.

The criteria for the stars are:

1. Michelin star **"A very good restaurant in its category"** (Une très bonne table dans sa catégorie)
2. Michelin stars: **"Excellent cooking, worth a detour"** (Table excellente, mérite un détour)
3. Michelin stars: **"Exceptional cuisine, worth a special journey"** (Une des meilleures tables, vaut le voyage)

Ther average price for a starred restaurant could start from 50€ up to more than 400€.

Thanks the [LaFourchette](https://www.lafourchette.com), you can book a restaurant at the best price and get exclusive offers and discount up to 50%.

![michelin](./img/michelin.png)

![lafourchette](./img/lafourchette.png)


### Investigation

#### Michelin Restaurant

command : node michelin.js

I take the name and the extension of url to the detailed page of the restaurant for all restaurants.
I saved the url's extension for later to be able to confirm the location of the restaurant to be sure it is the good one but i did not go through that part.

#### Deals from LaFourchette

command : node lafourchette.js

I collect the idea and sales types for each restaurants.
Each restaurants can have sale offer or special meal.


### Server-side with Node.js

We start with the michelin.js that creates a file output.json with the information it collects from each page of all the starred restaurants.

After that, we use lafourchette.js. It goes through the json file and take the name. Then, it uses the api "https://m.lafourchette.com/api/restaurant-prediction?name=" to find the id of the restaurants on lafouchette site.
With the id of each restaurant, we can use another api, "https://m.lafourchette.com/api/restaurant/+rid+/sale-type" , that gives all the special offers and special meals of the restaurant. I save the information on the special.json file so we can just run each time the lafourchette.js to actualize the offers.


### Client-side with React

I had some problems using to comprehend the promises and use them in my programs. It delayed me and i could not advance on the client-side part.

