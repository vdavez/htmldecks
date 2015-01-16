(function( window ){

    var body = document.body,
        mask = document.createElement("div"),
        toggleSlideLeft = document.querySelector( ".toggle-slide-left" ),
        slideMenuLeft = document.querySelector( ".slide-menu-left" ),
        activeNav
    ;
    mask.className = "mask";

    body.onkeydown = (function(e) {
        evt = e || window.event;
        if (evt.keyCode == 27) {
            if (activeNav == undefined || activeNav == "") {
                classie.add( body, "sml-open" );
                document.body.appendChild(mask);
                activeNav = "sml-open";
            }
            else {
                classie.remove( body, activeNav );
                activeNav = "";
                document.body.removeChild(mask);                
            }
        }
    });
})( window );