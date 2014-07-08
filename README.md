# streamhub-wall

[![Build Status](https://travis-ci.org/Livefyre/streamhub-wall.png)](https://travis-ci.org/Livefyre/streamhub-wall)

streamhub-wall displays StreamHub social feeds as a visually engaging, full-screen tiled Content experience that's great for covering live events, hosting photo contests, and powering social sections of your website.

## Getting Started

The quickest way to use streamhub-wall is to use the built version hosted on Livefyre's CDN.

### Usage

Add [Livefyre.js](//github.com/Livefyre/Livefyre.js) to your site.

```html
<script src="//cdn.livefyre.com/Livefyre.js"></script>
```

Use `Livefyre.require` to construct the component

```html
<script>
Livefyre.require([
    'streamhub-wall#3',
    'streamhub-sdk#2'
], function(LiveMediaWall, SDK) {    
    var wall = window.wall = new LiveMediaWall({
        el: document.getElementById("wall"),
        collection: new (SDK.Collection)({
            "network": "livefyre.com",
            "siteId": "313878",
            "articleId": "1",
            "environment": "livefyre.com"
        })
    });
});
</script>
```

You now have a Wall! See this all in action in [this example](http://codepen.io/gobengo/pen/dFwDL).

Note: Any styling customization of Tweets rendered by streamhub-sdk must be done in accordance with Twitter's [Display Requirements](https://dev.twitter.com/terms/display-requirements).

### Options

####```postButton```

What sort of "Post Content" button should appear on the LiveMediaWall, assuming opts.collection is passed and there is an auth integration on the page. Valid values are:

* `false` (default) - Do not show a "Post Content" button. The LiveMediaWall is effectively read-only
* `true` or `LiveMediaWall.postButtons.contentWithPhotos` - Include a button that lets users type textual Content with attached photos
* `LiveMediaWall.postButtons.content` - Include a button that lets users type textual Content, but not attach photos
* `LiveMediaWall.postButtons.photo` - Include a button that lets users add a photo, but no text

        var wallView = new LiveMediaWall({
            el: document.getElementById('wall'),
            collection: collection,
            postButton: true,
            minContentWidth: 300
        });

####```minContentWidth```
The Media Wall will choose an appropriate number of columns depending on the width of its
container element, ensuring that each column is at least this many pixels wide. Don't use
with the `columns` option.

        var wallView = new LiveMediaWall({
            el: document.getElementById('wall'),
            minContentWidth: 300
        });

####```columns```
The number of columns of content can be specified by the ```columns``` option at construction. This means the content width will adapt to the Media Wall's container size while respecting the specified number of columns. By default, the Media Wall's width divided by the minimum content width (300px) determines the number of columns.

        var wallView = new LiveMediaWall({
            el: document.getElementById('wall'),
            columns: 5
        });

####```modal```
By default, when there are attachments for a piece of content the thumbnail can be clicked, revealing a modal that displays the photo/video attachment in its entirety. To disable the modal set the ```modal``` option to ```false```.

        var wallView = new LiveMediaWall({
            el: document.getElementById('wall'),
            columns: 5,
            modal: false
        });

####```pickColumn```
By default, when content is inserted into the wall it will be populated into the column of the shortest height. To configure the strategy in which the column is chosen, specify the ```pickColumn``` option in the constructor. This option expects a function with args: ```(columnView, forcedIndex)```, and returns the zero-based index of the column to insert into.

```
var wall = new LiveMediaWall({
    el: el,
    pickColumn: function (columnView, forcedIndex) {
        var targetIndex;
        // the strategy
        return targetIndex;
    }
});
```

## Local Development

Instead of using a built version of streamhub-wall from Livefyre's CDN, you may wish to fork, develop on the repo locally, or include it in your existing JavaScript application.

Clone this repo

    git clone https://github.com/Livefyre/streamhub-wall

Development dependencies are managed by [npm](https://github.com/isaacs/npm), which you should install first.

With npm installed, install streamhub-wall's dependencies. This will also download [Bower](https://github.com/bower/bower) and use it to install browser dependencies.

    cd streamhub-wall
    make build

This repository's package.json includes a helpful script to launch a web server for development

    make server

You can now visit [http://localhost:8080/examples/mediawall](http://localhost:8080/examples/mediawall) to see an example wall loaded via RequireJS.

# StreamHub

[Livefyre StreamHub](http://www.livefyre.com/streamhub/) is used by the world's biggest brands and publishers to power their online Content Communities. StreamHub turns your site into a real-time social experience. Curate images, videos, and Tweets from across the social web, right into live blogs, chats, widgets, and dashboards. Want StreamHub? [Contact Livefyre](http://www.livefyre.com/contact/).
