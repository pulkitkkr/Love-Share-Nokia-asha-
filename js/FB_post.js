   FB.init({appId: "343420435759410", status: true, cookie: true});

      function postToFeed() {
	     calc();
	    // var percent =   document.getElementById('output').value;
        // calling the API ...
        var obj = {
          method: 'feed',
          redirect_uri: 'http://m.facebook.com',
          link: 'https://developers.facebook.com/docs/reference/dialogs/',
          picture: 'http://i.imgur.com/VOntFUr.png?1',
          name: 'Love Share',
          caption: 'via Love Share app',
          description: 'Love percentage of '+name1+' and '+name2+' is '+score+'%',
		  display: 'touch',
		  message: 'Facebook Dialogs are easy!'
        };
		
         
        function callback(response) {
          document.getElementById('msg').innerHTML = "Post ID: " + response['post_id'];
        }

        FB.ui(obj, callback);
      }
