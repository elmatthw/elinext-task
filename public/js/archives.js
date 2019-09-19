$(document).ready(function(){
    $.urlParam = function(name) {
        var results = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (!results) {
            return 0;
        }
        return results[1] || 0;
    };

    $.ajax({    
        type: 'GET',
        url: '/archives',
        cache: false,
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        complete: function(data){
            var page = $.urlParam('page')
            if (!page)
                page = 1
            $.ajax({
                type: 'GET',
                url: '/archives/all?page'+ page,
                cache: false,
                dataType: "json",
                contentType: "application/json; charset=UTF-8",
                success: function(data){
                    $('.pagination').on('click', function(event){
                        event.preventDefault()
                        event.stopPropagation()
                        var pagesAmount = data.count;
                        if ($(this).hasClass('next')) {
                            if (page != pagesAmount)
                                page++
                        }
                        else if ($(this).hasClass('prev') && page > 1) {
                            page--
                        }
                        window.location='/archives?page=' + page
                    })
                    $('div#archives').empty();
                    data.archives.forEach(function(element) {
                        $('div#archives').append('<div id="'+element._id + '">' + element.title + '<br>' + element.description + '</div>');
                        $('div#archives').append('<br><button class="more" id="'+element._id + '">More</button><br><br>')
                    });
                    $('button.more').on('click', function(event){
                        event.preventDefault();
                        event.stopPropagation();

                        let id = this.getAttribute('id');
                        window.location='archives/archive?id=' + id;
                    })
                }
            })
        },
        error: function(data){

        }
    })
})