$('button').on('click', function(event){
    event.preventDefault();
    event.stopPropagation();
    /* $('#status').empty().text('uploading...')
    $(this).ajaxSubmit({
        type: "POST",
        url: '/save',
        error: function(xhr) {
            status('Error: ' + xhr.status);
                },
    
                success: function(response) {
            $("#status").empty().text(response);
                    console.log(response);
                }
        
    })
    return false; */
    var file = $('input[type="file"]')[0].files[0];
    console.log(file);
    var formData = new FormData();
    formData.append('archive', file, file.name)
    var xhr = new XMLHttpRequest();
    console.log(formData);
    xhr.open('POST', '/save', true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            insertIntoDatabase(file.name, $('.description').val(), $('.expireDate').val(), $('.expireTime').val())
        } else {
            alert('An error occurred!');
        }
    };
    xhr.send(formData);

    })

$(document).ready(function(){
    $('.expireDate').mask("99.99.9999", {placeholder: "mm.dd.YYYY"});
    $('.expireTime').mask("99:99", {placeholder: "HH.MM"});

})

function insertIntoDatabase(title, description, date, time){
    var expire = new Date(date + " " + time).toISOString();
    $.ajax({
        type: 'POST',
        url: '/insert-into-database',
        cache: false,
        data: JSON.stringify({title, description, expire}),
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        success: function(data){
            $('div.status').append('Archive saved successfully');
        },
        error: function(data){
            $('div.status').append('Error');
        }
    })
}