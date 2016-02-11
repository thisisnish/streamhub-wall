define(function (require) {
  var Collection = require('streamhub-sdk/collection');
  var View = require('streamhub-wall');
  var $ = require('streamhub-sdk/jquery');

  return function (el) {
    var collection = new Collection({
      network: 'labs.fyre.co',
      environment: 'livefyre.com',
      siteId: '315833',
      articleId: 'livefyre-tweets'
    });
    var view = new View({el: el});
        
    collection.pipe(view);
        
        // As streamhub-wall#3 now inserts its own css, when this is run
        // on the app gallery we need to remove the sdk 2.7 css.
        // this is a weird hack. Sorry.
    $(function ($) {
      $('link[href*="sdk.min.css"]').remove();
    });

    return view;
  };
});
