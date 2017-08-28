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
], function (auth, createAuthButton, livefyreAuthDelegate, debug,
  $, Collection, Content, Auth, WallView, packageAttribute) {
  window.auth = auth;

  createAuthButton(auth, document.getElementById('auth-button'));

  var delegate = window.delegate = livefyreAuthDelegate('http://www.livefyre.com');
  auth.delegate(delegate);

  packageAttribute.decorate(document.getElementById('container'));

  var collections = [
    {
      network: 'build-validator-qa-s2.fyre.co',
      siteId: '291251',
      articleId: 'designer-app-1473897378865',
      environment: 'qa-ext.livefyre.com'
    },
    { // products
      network: 'qa-blank.fyre.co',
      siteId: '291345',
      articleId: 'designer-app-1490911843246',
      environment: 'qa-ext.livefyre.com'
    },
    { // products 2
      env: 'qa-ext.livefyre.com',
      network: 'qa-blank.fyre.co',
      siteId: '291364',
      articleId: 'designer-app-1489184626785'
    },
    { // products 3
      env: 'qa-ext.livefyre.com',
      network: 'qa-blank.fyre.co',
      siteId: '291364',
      articleId: 'designer-app-1487964533074'
    }
  ];

  window.Collection = Collection;
  var collection = new Collection(collections[2]);

  var wallView = window.view = new WallView({
    sharer: function (content) {
      console.log('share', content);
    },
    constrainAttachmentsByWidth: true,
    productDetailPhotoShow: true,
    productDetailTitleShow: true,
    productDetailPriceShow: true,
    showProduct: true
  });

  collection.pipe(wallView);

    // There is only one column at this point because the WallView's el is
    // not in the dom and so width 0
  document.getElementById('listView').appendChild(wallView.el);

    // Now it's in the DOM and is wider, but it doesn't magically know that.
    // call relayout to automatically detect right number of columns again
  wallView.relayout();
});
