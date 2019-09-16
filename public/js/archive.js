/* $(document).ready(function(){ */
    $.urlParam = function(name) {
        var results = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (!results) {
            return 0;
        }
        return results[1] || 0;
    };
    $.ajax({
        type: 'GET',
        url: '/archives/archive/get?id=' + $.urlParam('id'),
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        complete: function(data){
            $.ajax({
                type: 'GET',
                url: '/archives/archive',
                dataType: "json",
                contentType: "application/json; charset=UTF-8"
            })
            $('div').append(data.title + '<br>' + data.description);
        }
    })

    $('#seeLines').on('click', function(event) {
        event.preventDefault()
        event.stopPropagation()
        let line_number = $('#lines').val()
        $.ajax({
            type: 'GET',
            url: '/archives/archive/get/?=id' + $.urlParam('id') + '/lines/?lines=' + line_number,
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            success: function(data){
                data.lines.array.forEach(line => {
                    $('label.result').append(line + '\n')
                });
            },
            error: function(data){
                $('label.result').append(data.error)
            }
        })
    })
/* }) */