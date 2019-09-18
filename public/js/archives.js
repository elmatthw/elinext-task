$(document).ready(function(){

    $.ajax({    
        type: 'GET',
        url: '/archives',
        cache: false,
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        complete: function(data){
            $.ajax({
                type: 'GET',
                url: '/archives/all',
                cache: false,
                dataType: "json",
                contentType: "application/json; charset=UTF-8",
                success: function(data){
                    $('#demo').pagination({
                        dataSource: data.archives,
                        pageSize: 5,
                        showPageNumbers: false,
                        showNavigator: true,
                        callback: function(data, pagination) {
                            $('div.data-container').empty();
                            data.forEach(element => {
                                $('div.data-container').append('<div id="'+element._id + '">' + element.title + '<br>' + element.description + '</div>');
                                $('div.data-container').append('<br><button id="'+element._id + '">More</button><br><br>')
                            });
                            $('button').on('click', function(event){
                                event.preventDefault();
                                event.stopPropagation();

                                let id = this.getAttribute('id');
                                window.location='archives/archive?id=' + id;
                            })
                        }
                    })
                }
            })
        },
        error: function(data){

        }
    })
})