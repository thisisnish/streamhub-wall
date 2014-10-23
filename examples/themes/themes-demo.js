require([
    'livefyre-auth',
    'auth/contrib/auth-button',
    'livefyre-auth/livefyre-auth-delegate',
    'streamhub-sdk/debug',
    'streamhub-sdk/jquery',
    'streamhub-sdk/collection',
    'streamhub-sdk/content',
    'streamhub-sdk/auth',
    'streamhub-wall'
],function (auth, createAuthButton, livefyreAuthDelegate, debug,
$, Collection, Content, Auth, LiveMediaWall) {
    var opts = {
        "network": "livefyre.com",
        "siteId": "313878",
        "articleId": "1",
        "environment": "livefyre.com"
    };
    var collection = new Collection(opts);

    var wall1 = window.wall1 = new LiveMediaWall({
        el: document.getElementById("listView1"),
        collection: collection,
        cardBackgroundColor: '#333',
        textColor: 'magenta',
        linkColor: 'orange',
        footerTextColor: 'lime',
        displayNameColor: 'cyan',
        usernameColor: 'red',
        fontFamily: 'Helvetica, Arial',
        linkAttachmentBackgroundColor: '#555',
        linkAttachmentBorderColor: '#888'
    });

    var wall2 = window.wall2 = new LiveMediaWall({
        el: document.getElementById("listView2"),
        collection: collection,
        fontSize: 'small'
    });
});
