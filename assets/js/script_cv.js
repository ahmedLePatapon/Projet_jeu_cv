function scrollToAnchor(anchor){
    var aTag = $(anchor);
    $('html,body').animate({scrollTop: aTag.offset().top - 50},'slow');
}

$(document).ready(function() {
    $(".page-scroll").click(function() {
        let anchor = $(this).attr('href');
        scrollToAnchor(anchor);
    });
});