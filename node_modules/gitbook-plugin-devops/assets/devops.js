require(["gitbook", "jquery"], function (gitbook) {
    //baidu analytics
    var bd_token;
    //google search console
    var google_search;
    //google analytics
    var google_analytics;
    //livere comment
    var livere_token;

    //page open load
    gitbook.events.bind("start", function (e, config) {
        //read settings
        var devops = config["devops"];
        bd_token = devops.bd_token;
        google_search = devops.google_search;
        google_analytics = devops.google_analytics;
        livere_token = devops.livere_token;

        if ("/" == window.location.pathname) {
            var html = '<meta name="google-site-verification" content=' + google_search + ' />';
            $("head:first").children("title").before(html);
        }
    });

    //page change， click left item 
    gitbook.events.bind("page.change", function () {
        if ($("script[src*='baidu']").length == 0) {
            baidu(bd_token);
        }
        if ($("script[src*='googletagmanager']").length == 0) {
            google(google_analytics);
        }
        var lv = $("script[src*='livere']");
        if (lv.length > 0) {
            $(lv).remove();
            $("#lv-container").remove();
            livere(livere_token);
        } else {
            livere(livere_token);
        }
    });

    /**
     * create and insert script
     * @param url the module request url 
     * @param desc page comment，optional
     */
    function insertScript(url, desc) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.async = true;

        $("head:first").append(desc);
        $("head:first").append(script);
    }

    /**
     * install baidu analytics
     * @param token baidu analytics js token
     */
    function baidu(token) {
        if (token == undefined || token == null || token == "") {
            return;
        }
        insertScript("https://hm.baidu.com/hm.js?" + token, "<!-- Baidu Analytics JS -->");
    }

    /**
     * intall google analytics 
     * @param token google analytics js UA-ID
     */
    function google(token) {
        if (token == undefined || token == null || token == "") {
            return;
        }
        insertScript("https://www.googletagmanager.com/gtag/js?id=" + token, "<!-- Google Analytics JS -->");
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', token);
    }

    /**
     * intall livere comment
     * @param token  livere comment js token
     */
    function livere(token) {
        if (token == undefined || token == null || token == "") {
            return;
        }
        insertScript("https://cdn-city.livere.com/js/embed.dist.js", "<!-- Livere Comment JS -->");
        $('.page-inner').append('<div id="lv-container" data-id="city" data-uid="' + token + '"></div>');
    }
});