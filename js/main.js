var $container=$('.holder');
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
        console.log(url)
        app.getData(url, function(data){
            console.log(data.data);
            app.settings.after = data.data.after;
            console.log('saved after ' , app.settings.after);
            _posts = data.data.children;
            app.layoutPosts(_posts);
        });
        //$container.isotope();

        //lets add end of page scroll detection
        //detect when user is at the end of the page and load more posts
        $(window).scroll(function () { 
            console.log('scroll');
            if (app.settings.scroll) {
                return;
            }
            if($(window).scrollTop() + $(window).height() == app.getDocHeight()) {
                console.log("----------- bottom hit ---------------")
                app.settings.scroll = true;
                console.log(app.settings.after);
                //app.processData();
                // app.showLoader("show loader for infinite scorll ---");
                // app.getMorePosts();
                app.getPosts();
                //app.processData(data.data);
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
        console.log('getting more posts / next' + app.settings.after)
        var url = app.settings.baseURL + '?after=' + app.settings.after;
        console.log(url)
        
        app.getData(url, function(data){
            console.log(data.data);
            app.settings.after = data.data.after;
            _posts = data.data.children;
            app.insertNewPosts(_posts);
        });
    },

    makeBlocks:function(posts){
        app.settings.posts = '';
        console.log('making blocks' , posts);

        $.each(posts, function(index, val) {
             /* iterate through array or object */
             if(posts[index].data.domain=='i.imgur.com'){
                 
                app.settings.posts += '<div class="post" ><img src='+posts[index].data.url+' > </div>';
                //$('.holder').append('<div class="post" ><img src='+data.children[i].data.url+' > </div>')
            }
        });
        // for (var i = 0; i < posts.length; i++) {
        //     //console.log(posts[i].data);
        //     if(posts[i].data.domain=='i.imgur.com'){
                
        //         app.settings.posts += '<div class="post" ><img src='+posts[i].data.url+' > </div>';
        //         //$('.holder').append('<div class="post" ><img src='+data.children[i].data.url+' > </div>')
        //     }
        // };
        return app.settings.posts;
    },

    layoutPosts:function(posts){

        console.log(posts);

        var result = app.makeBlocks(_posts);
        var $blocks = $(result);


        
        $blocks.css('opacity', 0);

        $container.append($blocks);
        
        var imgLoad = imagesLoaded( $container );
        
        // function onAlways( instance ) {
        //   console.log('all images are loaded');
        // }
        
        // imgLoad.on( 'done', function( instance ) {
        //   console.log('DONE  - all images have been successfully loaded');
        // });

        imgLoad.on( 'progress', function( instance, image ) {
          var result = image.isLoaded ? 'loaded' : 'broken';
          console.log( 'image is ' + result + ' for ' + image.img.src );
          $container.append(image);

          $container.isotope({
            // options
            itemSelector: '.post',
            layoutMode: 'masonry',
            masonry:{
                columnWidth:400,
                gutter:10,
                isFitWidth: true
            }
          });
          $blocks.css('opacity', 1);
        });
        // $container.append($blocks).imagesLoaded( function() {
        //   $container.isotope({
        //     // options
        //     itemSelector: '.post',
        //     layoutMode: 'masonry',
        //     masonry:{
        //         columnWidth:400,
        //         gutter:10,
        //         isFitWidth: true
        //     }
        //   });
        //   $blocks.css('opacity', 1);
        // });

        app.settings.scroll = false;
    },

    // when new posts are added to an existing cotianer
    insertNewPosts:function(posts){
        //console.log(posts);
        console.log(posts);
        var $moreBlocks = $(app.makeBlocks(_posts));
        

        var imgLoad = imagesLoaded( $container );
        
        $moreBlocks.css('opacity', 0);
        $container.append($moreBlocks).imagesLoaded( function() {
            $container.isotope( 'appended', $moreBlocks );
            // we reveal the blocks now
            $moreBlocks.css('opacity', 1);
        });
        // imgLoad.on( 'progress', function( instance, image ) {
        //   var result = image.isLoaded ? 'loaded' : 'broken';
        //   console.log( 'image is ' + result + ' for ' + image.img.src );
        //   $container.isotope( 'insert', $moreBlocks )

        //   // $container.isotope({
        //   //   // options
        //   //   itemSelector: '.post',
        //   //   layoutMode: 'masonry',
        //   //   masonry:{
        //   //       columnWidth:400,
        //   //       gutter:10,
        //   //       isFitWidth: true
        //   //   }
        //   // });
        //   // $blocks.css('opacity', 1);
        // });
        app.settings.scroll = false;
    },

    // // when new posts are added to an existing cotianer
    // insertNewPosts:function(posts){
    //     //console.log(posts);
    //     console.log(posts);
    //     var $moreBlocks = $(app.makeBlocks(_posts));

    //     // we'll hide the blocks for now
    //     // $moreBlocks.css('opacity', 0);

    //     $container.append($moreBlocks).imagesLoaded( function() {
    //         $container.isotope( 'appended', $moreBlocks );
    //         // we reveal the blocks now
    //         // $moreBlocks.css('opacity', 1);
    //     });
    //     app.settings.scroll = false;
    // },

    getData:function(path, callback){
        // console.log('I am here');
        $.when($.ajax({
            url: path,
            type: 'GET',
            crossDomain: true,
            dataType:'json',
        }).done(function(data) {
            // _data = data;
        }).fail(function() {
            alert('Error from API - Please Try Again Later');
        }).always(function() {
            //console.log('complete');
        }))
        // on AJAX finish
        .then(function(data){
            callback(data);
        });
    }
};

$(document).ready(function() {
    app.init();
});