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
        url: '/get-archive/?id=' + $.urlParam('id'),
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        success: function(data){
            $.ajax({
                type: 'GET',
                url: '/archive',
                dataType: "json",
                contentType: "application/json; charset=UTF-8"
            })
            $('div').append(data.title + '<br>' + data.description);
        }
    })
})