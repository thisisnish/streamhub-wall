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
  window.auth = auth;

  createAuthButton(auth, document.getElementById('auth-button'));

  var delegate = window.delegate = livefyreAuthDelegate('http://www.livefyre.com');
  auth.delegate(delegate);

  var opts = {
    'network': 'livefyre.com',
    'siteId': '313878',
    'articleId': '1',
    'environment': 'livefyre.com'
  };
  window.Collection = Collection;

  window.view = new LiveMediaWall({
    el: document.getElementById('listView'),
    collection: opts,
    postButton: true,
    sharer: function (content) {
      // console.log('share', content);
    }
  });
});
