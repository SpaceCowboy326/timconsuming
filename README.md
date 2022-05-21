# Timconsuming

This is a personal project meant to share some of the things I've been consuming lately. The topics covered include Beverages, Media, Video Games, and Music.

## Description

While the goal is to share some of the things I've been enjoying (or not enjoying) lately, this was also started as a learning opportunity. I tried to build the site using a minimal number of external packages and a lot of custom styling.


### Check it Out!

You can see some version of this running at:
https://yubnub.net/

It's not always 100% up to date, but it should be pretty close!

### Dependencies

Requires a MongoDB connection for any of the list pages to work. The Music page requires a valid Spotify Client Secret Key to load.

The Music page also requires a Spotify login if you want to see the playlists/listen through the Web Player.


### Starting the Application

For production:

```
npm run build
npm run start
```

For development:
```
npm run dev
```

### The Building Blocks
- The app is built starting from create-next-app.
- There's a MongoDB database hosted on atlas containing all of the "item" info.
- MUI for UI components.
- react-query and some leftover swr for ajax requests.
- formidable for some help with uploading images.

And that's pretty much it. The web player also uses the Spotify SDK to stream music.


### Things I'd Like to Improve
Improving the Web Player to handle unexpected situations better and finding a better solution for Image handling and optimization are probably the top two improvements I would like to make to the site.


## Authors

This was worked on solely by Tim Hallowell, @SpaceCowboy326.


## License

This project is licensed under the MIT License - see the LICENSE.md file for details


## Acknowledgments

Nav Icons made by [Freepik](https://www.freepik.com/) from [www.flaticon.com](www.flaticon.com).
