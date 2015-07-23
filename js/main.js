
(function(){

    var $container = $('.holder');
    var preloader = $('.loader');

    window.preloader = preloader;

    var _posts;

    app = {
        settings:{
            baseURL : 'http://www.reddit.com/r/cats.json',
            scroll: false,
            next: null,
            posts:'',
        },
        init:function(){
            console.log('meow');

            //next post is http://www.reddit.com/r/cats.json?after=t3_2bz3x4

            // plan
            // start the app. add istope.
            // load first 20
            // save new next key
            // pass results to make strings
            // do a layout
            // hit end of page. run get posts but now pass next key
            // pass results to make strings
            // insert new posts

            var url = app.settings.baseURL;
            // console.log(url)
            app.getData(url, function(data){
                app.settings.after = data.data.after;
                // console.log('saved after ' , app.settings.after);
                _posts = data.data.children;
                app.layoutPosts(_posts);
            });

            $(window).scroll(function () { 
                if (app.settings.scroll) {
                    return;
                }
                if($(window).scrollTop() + $(window).height() == app.getDocHeight()) {
                    console.log("----------- bottom hit ---------------");
                    app.settings.scroll = true;
                    preloader.fadeIn();
                    app.getPosts();
                    
                }
            });

        },

        getDocHeight:function(){
            var D = document;
            return Math.max(
                D.body.scrollHeight, D.documentElement.scrollHeight,
                D.body.offsetHeight, D.documentElement.offsetHeight,
                D.body.clientHeight, D.documentElement.clientHeight
            );
        },

        getPosts:function(){
            //this just gets posts with a pass param or not and then returns these posts
            // console.log('getting more posts / next' + app.settings.after)
            var url = app.settings.baseURL + '?after=' + app.settings.after;
            // console.log(url)
            
            app.getData(url, function(data){
                // console.log(data.data);
                app.settings.after = data.data.after;
                _posts = data.data.children;
                app.insertNewPosts(_posts);
            });
        },

        makeBlocks:function(posts){
            app.settings.posts = '';
            // console.log('making blocks' , posts);

            var imgurl;

            $.each(posts, function(index, val) {
                 /* iterate through array or object */

                 if(posts[index].data.domain=='imgur.com'){
                    // console.log('imugr ', posts[index].data);


                    console.log(posts[index].data.url);
                    if((posts[index].data.url.split("/"))[3] === 'a'){
                        console.log("rejected /a/ === ",posts[index].data.url);
                        return;
                    } else if ((posts[index].data.url.split("/"))[3] === 'gallery'){
                        console.log("rejected /gallery/ ===",posts[index].data.url);
                        return;
                    } else if ((posts[index].data.url.split("/"))[3] === 'r'){
                        console.log("rejected /r/ ===",posts[index].data.url);
                        return;
                    } else {
                        imgurl = "http://i.imgur.com/"+ (posts[index].data.url.split("/"))[3] +".jpg";
                        app.settings.posts += '<div class="post" ><img src='+imgurl+' > </div>';
                    }
                 }


                 if(posts[index].data.domain=='i.imgur.com'){
                    
                    // console.log(posts[index].data.url);
                    if( (posts[index].data.url.indexOf('.webm') === -1) === false ) {
                       // console.log('videos');
                       app.settings.posts += '<div class="post" ><video src="'+posts[index].data.url+'" autoplay loop> </video></div>';
                    
                    } else {
                       // console.log('image');    
                       app.settings.posts += '<div class="post" ><img src='+posts[index].data.url.replace(/.jpg/i, "l.jpg")+' > </div>';
                    }                    
                }
            });
            return app.settings.posts;
        },

        layoutPosts:function(posts){

            // console.log(posts);

            var result = app.makeBlocks(_posts);
            var $blocks = $(result);

          
            $blocks.css('opacity', 0);

            $container.append($blocks);
            
            var imgLoad = imagesLoaded( $container );
            
            imgLoad.on( 'progress', function( instance, image ) {
              var result = image.isLoaded ? 'loaded' : 'broken';
              // console.log( 'image is ' + result + ' for ' + image.img.src );
              $container.append(image);

              $container.isotope({
                // options
                itemSelector: '.post',
                layoutMode: 'masonry',
                masonry:{
                    gutter:10,
                    isFitWidth: true
                }
              });
              $blocks.css('opacity', 1);

            });

            app.settings.scroll = false;
        },

        // when new posts are added to an existing cotianer
        insertNewPosts:function(posts){
            // console.log(posts);
            // console.log(posts);
            var $moreBlocks = $(app.makeBlocks(_posts));

            var imgLoad = imagesLoaded( $container );
            
            // $moreBlocks.css('opacity', 0);

            $container.append($moreBlocks).imagesLoaded( function() {
            
                $container.isotope( 'appended', $moreBlocks );
            
                // $moreBlocks.css('opacity', 1);
            
                app.settings.scroll = false;    
            });
            
            

            preloader.fadeOut();
        },

        getData:function(path, callback){
            // console.log('I am here');
            $.ajax({
                url: path,
                type: 'GET',
                crossDomain: true,
                dataType:'json',
            })
            
            .done(function(data) {
                console.log('data call complete');
            })
            
            .fail(function(error) {
                alert('error ', error);
            })

            .then(function(data){
                callback(data);
            });
        }
    };

    // start
    app.init();
})();