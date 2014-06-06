require([
    'auth',
    'livefyre-auth',
    'auth/contrib/auth-button',
    'livefyre-auth/livefyre-auth-delegate',
    'streamhub-sdk/debug',
    'streamhub-sdk/jquery',
    'streamhub-sdk/collection',
    'streamhub-sdk/content',
    'streamhub-sdk/auth',
    'streamhub-wall'
],function (auth, authLivefyre, createAuthButton, livefyreAuthDelegate, debug,
$, Collection, Content, Auth, LiveMediaWall) {
    window.auth = auth;
    var log = debug('streamhub-sdk/auth-demo');
    var authButton = createAuthButton(auth, document.getElementById('auth-button'));

    authLivefyre.plugin(auth);
    var delegate = window.delegate = livefyreAuthDelegate('http://www.livefyre.com');
    auth.delegate(delegate);

    var opts = {
        "network": "livefyre.com",
        "siteId": "313878",
        "articleId": "1",
        "environment": "livefyre.com"
    };
    var collection = new Collection(opts);

    var wall = window.view = new LiveMediaWall({
        el: document.getElementById("listView"),
        collection: collection,
        postButton: true,
        sharer: function (content) {
            console.log('share', content);
        }
    });
});
