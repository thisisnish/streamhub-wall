require([
    'auth',
    'auth/contrib/auth-button',
    'livefyre-auth/livefyre-auth-delegate',
    'streamhub-sdk/debug',
    'streamhub-sdk/jquery',
    'streamhub-sdk/collection',
    'streamhub-sdk/content',
    'streamhub-sdk/auth',
    'streamhub-wall/wall-view',
    'streamhub-wall/package-attribute'
],function (auth, createAuthButton, livefyreAuthDelegate, debug,
$, Collection, Content, Auth, WallView, packageAttribute) {
    window.auth = auth;
    var log = debug('streamhub-sdk/auth-demo');
    var authButton = createAuthButton(auth, document.getElementById('auth-button'));
    var delegate = window.delegate = livefyreAuthDelegate('http://www.livefyre.com');
    auth.delegate(delegate);

    packageAttribute.decorate(document.getElementById('container'));

    var opts = {
        "network": "livefyre.com",
        "siteId": "313878",
        "articleId": "1",
        "environment": "livefyre.com"
    };
    var collection = new Collection(opts);

    var wallView = window.view = new WallView({
        sharer: function (content) {
            console.log('share', content);
        }
    });

    collection.pipe(wallView);

    // There is only one column at this point because the WallView's el is
    // not in the dom and so width 0
    document.getElementById("listView").appendChild(wallView.el)

    // Now it's in the DOM and is wider, but it doesn't magically know that.
    // call relayout to automatically detect right number of columns again
    wallView.relayout();
});
