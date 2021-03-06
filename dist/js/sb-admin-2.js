$(function () {
    $('#side-menu').metisMenu();
});

function openLink(event) {
    event.preventDefault();
    var href = $(this).attr('href');
    if (href) {
        if ($(this).is('.ajax')) {
            var URL = href;
            // testa se é um doc do proprio repositório deo jediprojects
            if ($(this).is('.docs')) {
                var URL = 'https://raw.githubusercontent.com/jediproject/jediproject.github.io/master/docs/' + href + '.md';
            } else if (URL.indexOf('http') != 0 || URL.indexOf('https://github.com/jediproject/') == 0) {
                URL = 'https://raw.githubusercontent.com/jediproject/' + href.replace('https://github.com/jediproject/', '') + '/master/README.md';
            }
            $.get(URL, function (content) {
                // se url for modificada é pq é um .md
                if (URL != href) {
                    $('#content').empty().append($('<div class="container-fluid"></div>').html(marked(content)));
                } else {
                    var contentBody = $(content).filter('#contents');
                    if (contentBody.length > 0) {
                        $('#content').empty().append($('<div class="container-fluid"></div>').append(contentBody));
                    }
                }
                // qualquer link para componentes jedi serão abertos pelo openLink
                $('#content').find("a[href*='jedi']:not(h1 a)").addClass('ajax').click(openLink).each(function () {
                    if (this.href.indexOf('&') > -1) {
                        this.href = this.href.substring(this.href.indexOf('https://github'), this.href.indexOf('&'));
                    }
                });
            });
        } else {
            $('#content').load(href);
        }
    }
}

$(document).ready(function () {
    $('#content').load('home.html');
    $('#side-menu li a').click(openLink);
});

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function () {
    $(window).bind("load resize", function () {
        topOffset = 50;
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    var url = window.location;
    var element = $('ul.nav a').filter(function () {
        return this.href == url || url.href.indexOf(this.href) == 0;
    }).addClass('active').parent().parent().addClass('in').parent();
    if (element.is('li')) {
        element.addClass('active');
    }
});