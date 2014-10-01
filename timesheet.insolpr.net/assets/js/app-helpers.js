'use-strict';

var helper = {
    server: {
        ajaxUrl: function returnAjaxProcessPage(section, page) {
            return "pages/" + section + "/" + page + "Process.jsp";
        },
        get: function getFromServer(url, params, successCallback) {
            params.isajax = true;
            $.ajax({
                type: "GET",
                url: url,
                data: params,
                async: false,
                timeout: 30000,
                complete: function(xhr) {
                    if (xhr.responseText != null && xhr.responseText != '') {
                        if (params.debug) {
                            console.warn("Response from Server:", $
                                    .trim(xhr.responseText));
                        }

                        if (xhr.status == 200) {
                            try {
                                successCallback(jQuery.parseJSON($
                                        .trim(xhr.responseText)));
                            } catch (error) {
                                successCallback($.trim(xhr.responseText));
                            }

                        }
                    } else {
                        successCallback($.trim({}));
                    }
                }
            });
        },
        post: function postToServer(url, formData, isJson, successCallback) {

            if (formData.debug) {
                console.time("POST TO: " + url);
            }
            formData.isajax = true;
            console.log("Before Post:", formData);
            $.ajax({
                type: "POST",
                url: url,
                data: formData,
                async: false,
                timeout: 30000,
                complete: function(xhr) {
                    console.warn("RESPONSE XHR:", xhr);
                    if (xhr.responseText != null && xhr.responseText != '') {

                        if (formData.debug) {
                            console.warn("Response from Server:", $
                                    .trim(xhr.responseText));
                        }
                        if (xhr.status == 200) {
                            // try {
                            // successCallback(jQuery.parseJSON($.trim(xhr.responseText)));
                            // } catch(error) {
                            successCallback($.trim(xhr.responseText));
                            // }

                        }
                    } else {
                        successCallback($.trim({}));
                    }
                }
            });
            console.timeEnd("POST TO: " + url);
        },
        defered: $.Deferred(),
        deferedObjects: {},
        sendQueries: function() {

        }
    },
    notification: {
        show: function(msg, nType) {
            $.growl(msg, {
                type: nType,
                align: 'center',
                width: 'auto',
                delay: 3000,
                allow_dismiss: false
            });
        },
        isOn: false
    },
    cookie: {
        get: function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i].trim();
                if (c.indexOf(name) == 0)
                    return c.substring(name.length, c.length);
            }
            return "";

        },
        set: function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toGMTString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
        },
        destroy: function deleteCookie(cname) {
            document.cookie = cname
                    + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    },
    input: {
        clean: function(str) {
            str = str.replace(/<o:p>\s*<\/o:p>/g, "");
            str = str.replace(/<o:p>.*?<\/o:p>/g, "&nbsp;");
            str = str.replace(/\s*mso-[^:]+:[^;"]+;?/gi, "");
            str = str.replace(/\s*MARGIN: 0cm 0cm 0pt\s*;/gi, "");
            str = str.replace(/\s*MARGIN: 0cm 0cm 0pt\s*"/gi, "\"");
            str = str.replace(/\s*TEXT-INDENT: 0cm\s*;/gi, "");
            str = str.replace(/\s*TEXT-INDENT: 0cm\s*"/gi, "\"");
            str = str.replace(/\s*TEXT-ALIGN: [^\s;]+;?"/gi, "\"");
            str = str.replace(/\s*PAGE-BREAK-BEFORE: [^\s;]+;?"/gi, "\"");
            str = str.replace(/\s*FONT-VARIANT: [^\s;]+;?"/gi, "\"");
            str = str.replace(/\s*tab-stops:[^;"]*;?/gi, "");
            str = str.replace(/\s*tab-stops:[^"]*/gi, "");
            str = str.replace(/\s*face="[^"]*"/gi, "");
            str = str.replace(/\s*face=[^ >]*/gi, "");
            str = str.replace(/\s*FONT-FAMILY:[^;"]*;?/gi, "");
            str = str.replace(/<(\w[^>]*) class=([^ |>]*)([^>]*)/gi, "<$1$3");
            str = str.replace(/<(\w[^>]*) style="([^\"]*)"([^>]*)/gi, "<$1$3");
            str = str.replace(/\s*style="\s*"/gi, '');
            str = str.replace(/<SPAN\s*[^>]*>\s*&nbsp;\s*<\/SPAN>/gi, '&nbsp;');
            str = str.replace(/<SPAN\s*[^>]*><\/SPAN>/gi, '');
            str = str.replace(/<(\w[^>]*) lang=([^ |>]*)([^>]*)/gi, "<$1$3");
            str = str.replace(/<SPAN\s*>(.*?)<\/SPAN>/gi, '$1');
            str = str.replace(/<FONT\s*>(.*?)<\/FONT>/gi, '$1');
            str = str.replace(/<\\?\?xml[^>]*>/gi, "");
            str = str.replace(/<\/?\w+:[^>]*>/gi, "");
            str = str.replace(/<H\d>\s*<\/H\d>/gi, '');
            str = str.replace(/<H1([^>]*)>/gi, '');
            str = str.replace(/<H2([^>]*)>/gi, '');
            str = str.replace(/<H3([^>]*)>/gi, '');
            str = str.replace(/<H4([^>]*)>/gi, '');
            str = str.replace(/<H5([^>]*)>/gi, '');
            str = str.replace(/<H6([^>]*)>/gi, '');
            str = str.replace(/<\/H\d>/gi, '<br>');
            str = str.replace(/<(U|I|STRIKE)>&nbsp;<\/\1>/g, '&nbsp;');
            str = str.replace(/<(B|b)>&nbsp;<\/\b|B>/g, '');
            str = str.replace(/<([^\s>]+)[^>]*>\s*<\/\1>/g, '');
            str = str.replace(/<([^\s>]+)[^>]*>\s*<\/\1>/g, '');
            str = str.replace(/<([^\s>]+)[^>]*>\s*<\/\1>/g, '');
            // some RegEx code for the picky browsers
            var re = new RegExp("(<P)([^>]*>.*?)(<\/P>)", "gi");
            str = str.replace(re, "<div$2</div>");
            var re2 = new RegExp(
                    "(<font|<FONT)([^*>]*>.*?)(<\/FONT>|<\/font>)", "gi");
            str = str.replace(re2, "<div$2</div>");
            str = str.replace(/size|SIZE = ([\d]{1})/g, '');
            str = str.replace(/\0129-\9999/g, '');
            str = str.replace(/[\u00FF-\uFFFF]*/g, '');
            return str;
        }
    }
};
