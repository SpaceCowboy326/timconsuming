# Timconsuming

This is a personal project meant to share some of the things I've been consuming lately. The topics covered include Beverages, Media, Video Games, and Music.

## Description

While the goal is to share some of the things I've been enjoying (or not enjoying) lately, this was also started as a learning opportunity. I tried to build the site using a minimal number of external packages and a lot of custom styling.


### Check it Out!

You can see some version of this running at:
https://yubnub.net/

It currently requires manual updates, so it may not be 100% up to date with the code.


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

And that's pretty much it.  There are a couple leftover dependencies from earlier iterations that can almost be removed (sass, swr, react-transition-group). It's a silly project with no real purpose, but it was fun to create and I enjoy sharing the things I've consumed with the world.

### Things I'd Like to Improve
Improving the Web Player to handle unexpected situations better and finding a better solution for Image handling and optimization are probably the top two improvements I would like to make to the site.


## Authors

This was worked on solely by Tim Hallowell, @SpaceCowboy326.


## License

This project is licensed under the MIT License - see the LICENSE.md file for details

## Acknowledgments

Nav Icons made by [Freepik](https://www.freepik.com/) from [www.flaticon.com](www.flaticon.com).
