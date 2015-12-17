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

####```initial```

Number. The number of Content items to render on page load. Defaults to 50.

        var wallView = new LiveMediaWall({
            el: document.getElementById('wall'),
            initial: 10
        });

####```showMore```

Number. The number of Content items to add to the wall when 'show more' is clicked.

        var wallView = new LiveMediaWall({
            el: document.getElementById('wall'),
            showMore: 10
        });

####```postButton```

Boolean or String. What sort of "Post Content" button should appear on the LiveMediaWall, assuming opts.collection is passed and there is an auth integration on the page. Valid values are:

* `false` (default) - Do not show a "Post Content" button. The LiveMediaWall is effectively read-only
* `true` or `LiveMediaWall.postButtons.contentWithPhotos` - Include a button that lets users type textual Content with attached photos
* `LiveMediaWall.postButtons.contentWithVideos` - Include a button that lets users type textual Content with attached videos
* `LiveMediaWall.postButtons.contentWithPhotosAndVideos` - Include a button that lets users type textual Content with attached videos or photos
* `LiveMediaWall.postButtons.content` - Include a button that lets users type textual Content, but not attach photos
* `LiveMediaWall.postButtons.photo` - Include a button that lets users add a photo, but no text
* `LiveMediaWall.postButtons.video` - Include a button that lets users add a video, but no text
* `LiveMediaWall.postButtons.photosAndVideos` - Include a button that lets users add a photo or video, but no text

        var wallView = new LiveMediaWall({
            el: document.getElementById('wall'),
            collection: collection,
            postButton: true,
            minContentWidth: 300
        });

####```postButtonText```

String. Sets the text of the “What’s on your mind?” button. Default value: “Whats on your mind?”.

        var wallView = new LiveMediaWall({
            el: document.getElementById('wall'),
            postButtonText: “Whats on your mind?”
        });

####```postModalTitle```

String. Sets the title of the UGC upload dialog. Default value: “Post Your Comment”.

        var wallView = new LiveMediaWall({
            el: document.getElementById('wall'),
            postModalTitle: “Post Your Comment”
        });

####```postModalButton```

String. Sets the button text of the UGC upload dialog. Default value: “Post Your Comment”.

        var wallView = new LiveMediaWall({
            el: document.getElementById('wall'),
            postModalButton: “Post Your Comment”
        });

####```postModalPlaceholder```

String. Sets the content placeholder of the UGC upload dialog. Default value: “What would you like to say?”.

        var wallView = new LiveMediaWall({
            el: document.getElementById('wall'),
            postModalPlaceholder: “What would you like to say?”
        });

####```minContentWidth```

Number. The Media Wall will choose an appropriate number of columns depending on the width of its
container element, ensuring that each column is at least this many pixels wide. Don't use
with the `columns` option.

        var wallView = new LiveMediaWall({
            el: document.getElementById('wall'),
            minContentWidth: 300
        });

####```columns```

Number. The number of columns of content can be specified by the ```columns``` option at construction. This means the content width will adapt to the Media Wall's container size while respecting the specified number of columns. By default, the Media Wall's width divided by the minimum content width (300px) determines the number of columns.

        var wallView = new LiveMediaWall({
            el: document.getElementById('wall'),
            columns: 5
        });

####```modal```

Boolean. By default, when there are attachments for a piece of content the thumbnail can be clicked, revealing a modal that displays the photo/video attachment in its entirety. To disable the modal set the ```modal``` option to ```false```.

        var wallView = new LiveMediaWall({
            el: document.getElementById('wall'),
            columns: 5,
            modal: false
        });

####```pickColumn```

Function. By default, when content is inserted into the wall it will be populated into the column of the shortest height. To configure the strategy in which the column is chosen, specify the ```pickColumn``` option in the constructor. This option expects a function with args: ```(columnView, forcedIndex)```, and returns the zero-based index of the column to insert into.

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

### Styling Options

The constructor supports the following explicit styling options. If you plan to frequently upgrade streamhub-wall versions (e.g. by embedding with a Livefyre.require version range), you should use these options for visual customization and *not* use external CSS with your own selectors.

The actual DOM structure of rendered instances may change from version to version, but these configuration values abstract the specific CSS Selectors being used to style things, which will change over time.

####`cardBackgroundColor`

[CSS Color](http://www.w3.org/TR/css3-color/#colorunits) String. The value to change the background color of a content card in the media wall.

```
var wall = new LiveMediaWall({
    el: el,
    cardBackgroundColor: 'blue'
```

####`linkColor`

[CSS Color](http://www.w3.org/TR/css3-color/#colorunits) String. The value to change the color of hyperlinks (e.g. Links in body, display name link).

```
var wall = new LiveMediaWall({
    el: el,
    linkColor: 'red'
});
```

####`textColor`

[CSS Color](http://www.w3.org/TR/css3-color/#colorunits) String. The value to change the color of text.

```
var wall = new LiveMediaWall({
    el: el,
    textColor: '#333`
```

####`footerTextColor`

[CSS Color](http://www.w3.org/TR/css3-color/#colorunits) String. The value to change the color of secondary text (e.g. Footer text, username in byline).

```
var wall = new LiveMediWall({
    el: el,
    footerTextColor: '#CCC'
});
```

####`displayNameColor`

[CSS Color](http://www.w3.org/TR/css3-color/#colorunits) String. The value to change the color of the display name in the byline.

```
var wall = new LiveMediaWall({
    el: el,
    displayNameColor: 'orange'
});
```

####`usernameColor`

[CSS Color](http://www.w3.org/TR/css3-color/#colorunits) String. The value to change the color of the username in the byline

```
var wall = new LiveMediaWall({
    el: el,
    usernameColor: 'green'
});
```

####`fontFamily`

[CSS Font Family](http://www.w3.org/TR/CSS2/fonts.html#propdef-font-family) String. The value to change the font family of the body text

```
var wall = new LiveMediaWall({
    el: el,
    fontFamily: 'Helvetica, Arial, sans-serif'
});
```

####`sourceLogoColor`

[CSS Color](http://www.w3.org/TR/css3-color/#colorunits) String. The color of the source logo.

####`buttonTextColor`

[CSS Color](http://www.w3.org/TR/css3-color/#colorunits) String. The color for the button labels

####`buttonHoverBackgroundColor`

[CSS Color](http://www.w3.org/TR/css3-color/#colorunits) String. The color of the button background on hover

####`buttonActiveBackgroundColor`

[CSS Color](http://www.w3.org/TR/css3-color/#colorunits) String. The color of the button background when `:active`.

####`buttonBorderColor`

[CSS Color](http://www.w3.org/TR/css3-color/#colorunits) String. The color of button borders.

####`bodyFontSize`
[CSS Font Size](http://www.w3.org/TR/CSS2/fonts.html#font-size-props) String. The font size of content body text

####`bodyLineHeight`
[CSS Line Height](http://www.w3.org/TR/CSS2/visudet.html#propdef-line-height) String. The line height of content body text

####`titleFontSize`
[CSS Font Size](http://www.w3.org/TR/CSS2/fonts.html#font-size-props) String. The font size of content title

####`titleLineHeight`
[CSS Line Height](http://www.w3.org/TR/CSS2/visudet.html#propdef-line-height) String. The line height of content title

####`linkAttachmentTextColor`
[CSS Color](http://www.w3.org/TR/css3-color/#colorunits) String. The color of link attachment text

####`linkAttachmentBackgroundColor`
[CSS Color](http://www.w3.org/TR/css3-color/#colorunits) String. The background color of link attachments (stacked attachments)

####`linkAttachmentBorderColor`
[CSS Color](http://www.w3.org/TR/css3-color/#colorunits) String. The border color of link attachments (stacked attachments)

## Local Development

Instead of using a built version of streamhub-wall from Livefyre's CDN, you may wish to fork, develop on the repo locally, or include it in your existing JavaScript application.

Clone this repo

    git clone https://github.com/Livefyre/streamhub-wall

Development dependencies are managed by [npm](https://github.com/isaacs/npm), which you should install first.

With npm installed, install streamhub-wall's dependencies. This will also download [Bower](https://github.com/bower/bower) and use it to install browser dependencies.

    cd streamhub-wall
    make build

To generate build artifacts:

    make dist

This repository's package.json includes a helpful script to launch a web server for development

    make server

You can now visit [http://localhost:8080/examples/mediawall](http://localhost:8080/examples/mediawall) to see an example wall loaded via RequireJS.

# StreamHub

[Livefyre StreamHub](http://www.livefyre.com/streamhub/) is used by the world's biggest brands and publishers to power their online Content Communities. StreamHub turns your site into a real-time social experience. Curate images, videos, and Tweets from across the social web, right into live blogs, chats, widgets, and dashboards. Want StreamHub? [Contact Livefyre](http://www.livefyre.com/contact/).
