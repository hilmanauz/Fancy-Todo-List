$( document ).ready(function() {

    "use strict";

    var todo = function() { 
        $('.todo-list .todo-item input').click(function(e) {
        e.preventDefault();
        if($(this).is(':checked')) {
            $(this).parent().parent().parent().toggleClass('complete');
        } else {
            $(this).parent().parent().parent().toggleClass('complete');
        }
    });
    
    
    $('.todo-nav .active-task').click(function(e) {
        e.preventDefault();
        $('.todo-list').removeClass('only-complete');
        $('.todo-list').addClass('only-active');
        $('.todo-nav a.all').removeClass('active');
        $('.todo-nav a.completed').removeClass('active');
        $('.todo-nav a.actived').addClass('active');
    });
    
    $('.todo-nav .all-task').click(function(e) {
        e.preventDefault();
        $('.todo-list').removeClass('only-active');
        $('.todo-list').removeClass('only-complete');
        $('.todo-nav a.completed').removeClass('active');
        $('.todo-nav a.actived').removeClass('active');
        $('.todo-nav a.all').addClass('active');
    });

    $('.todo-nav .completed-task').click(function(e) {
        e.preventDefault();
        $('.todo-list').removeClass('only-active');
        $('.todo-list').addClass('only-complete');
        $('.todo-nav a.all').removeClass('active');
        $('.todo-nav a.actived').removeClass('active');
        $('.todo-nav a.completed').addClass('active');
    });
    
    $('#uniform-all-complete input').click(function(e) {
        e.preventDefault();
        if($(this).is(':checked')) {
            $('.todo-item .checker span:not(.checked) input').click();
        } else {
            $('.todo-item .checker span.checked input').click();
        }
    });
    };
    
    todo();
    
}); 