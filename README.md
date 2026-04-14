# Project 7: NASA API - Space Explorer App
NASA releases a new "Astronomy Picture of the Day" (APOD) every day—spotlighting breathtaking images of galaxies, stars, planets, and more.

Your task is to build an interactive web app that fetches and displays these photos using [NASA's API](https://api.nasa.gov/). Users will pick a date range and instantly view stunning photos from across the cosmos, along with titles and descriptions.

You'll get to use your skills to build something that's actually connected to real-world data from one of the most iconic organizations in the world.

## Starter Files
- The provided files include a NASA logo, date inputs, a button, a placeholder for your gallery, and basic layout and styling to help you get started.
- It also includes built-in logic (in `dateRange.js`) to handle the valid APOD date range—from June 16, 1995 to today. No need to modify it.
- All your custom JavaScript should go in `script.js`. That's where you'll write the code that fetches data and displays your gallery.

## Developer Notes - Matthew Marlatt
As stated above, this website uses NASA's public APOD API to display every "Astronomy Picture of the Day" from the start date you select to the end date that you select. If you really want, you can go through every "Astronomy Picture of the Day" that is available. These pictures are organized from earliest to latest in a gallery which the user can interact with. There is a details button on each card that when clicked, opens a modal window that shows
the image, title, and description of that "Astronomy Picture of the Day."
