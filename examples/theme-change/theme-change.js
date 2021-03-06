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
  var delegate = window.delegate = livefyreAuthDelegate('http://www.qa-ext.livefyre.com');
  auth.delegate(delegate);

  var opts = {
    'network': 'livefyre.com',
    'siteId': '290596',
    'articleId': '303',
    'environment': 'qa-ext.livefyre.com'
  };
  window.Collection = Collection;
  var wall = window.view = new LiveMediaWall({
    el: document.getElementById('listView'),
    collection: new Collection(opts),
    postButton: true,

    postButtonText: 'its post button text',             // Default value: 'What's on your mind?'
    postModalTitle: 'its post modal title',             // Default value: 'Post Your Comment'
    postModalButton: 'its post modal button',           // Default value: 'Post Your Comment'
    postModalPlaceholder: 'its post modal placeholder', // Default value: 'What would you like to say?'

    sharer: function (content) {
      console.log('share', content);
    }
  });


  $('.head button').on('click', function (ev) {
    var config = {};
    var name = ev.target.name;

    switch (name) {
      case 'red':
      case 'black':
      case 'yellow':
        config.linkColor = name;
        break;
      case 'lightTheme':
        config = {
          linkAttachmentTextColor: '#666666',
          linkAttachmentBackgroundColor: '#f2f2f2',
          linkAttachmentBorderColor: 'rgba(0,0,0,0.3)',
          buttonTextColor: '#ffffff',
          cardBackgroundColor: '#fff',
          textColor: '#4c4c4c',
          footerTextColor: '#b2b2b2'
        };
        break;
      case 'darkTheme':
        config = {
          linkAttachmentTextColor: '#999999',
          linkAttachmentBackgroundColor: '#403d47',
          linkAttachmentBorderColor: 'rgba(0,0,0,0.5)',
          buttonTextColor: '#ffffff',
          cardBackgroundColor: '#343139',
          textColor: 'rgba(255, 255, 255, 0.7)',
          footerTextColor: 'rgba(255, 255, 255, 0.3)',
          sourceLogoColor: 'rgba(255, 255, 255, 0.3)'
        };
        break;
      case 'uploadvideo':
        config = {
          postButton: 'video'
        };
        break;
      case 'uploadphoto':
        config = {
          postButton: 'photo'
        };
        break;
      case 'uploadphotovideo':
        config = {
          postButton: 'photoAndVideo'
        };
        break;
      case 'uploadtextphotovideo':
        config = {
          postButton: 'contentWithPhotoAndVideo'
        };
        break;
      case 'uploadtextvideo':
        config = {
          postButton: 'contentWithVideo'
        };
        break;
      case 'uploadtextvideotitle':
        config = {
          postButton: 'contentWithVideo',
          postConfig: {
            showTitle: true
          }
        };
        break;
      case 'uploadtextvideosingle':
        config = {
          postButton: 'contentWithVideo',
          postConfig: {
            maxAttachmentsPerPost: 1,
            mediaRequired: true
          }
        };
        break;
      default:
    }

    wall.configure(config);
  });
});
