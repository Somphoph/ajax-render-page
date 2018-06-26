(function ($) {

    $.fn.objectifyForm = function () {
        var returnArray = {};
        if (this.is('form')) {
            var formArray = this.serializeArray();
            for (var i = 0; i < formArray.length; i++) {
                returnArray[formArray[i]['name']] = formArray[i]['value'];
            }
        } else {
            throw "This function only for form element."
        }
        return returnArray;
    }


    function render(renderIn, data, isOverride) {
        if ($.isArray(renderIn)) {
            for (var i = 0; i < renderIn.length; i++) {
                renderX(renderIn[i], data, isOverride);
            }
        } else {
            renderX(renderIn, data, isOverride);
        }
    }

    function renderX(renderId, data, isOverride) {
        if (renderId === "@all" || typeof renderId === "undefined") {
            document.open();
            document.write(data);
            document.close();
        } else {

            var mode = "OVER";
            var renderXd = renderId;
            isOverride = (typeof isOverride === "undefined");
            mode = isOverride ? "OVER" : "IN";

            var ele = $('#' + renderXd);
            if (ele.length > 0) {
                if (mode == "OVER")
                    ele.replaceWith(data);
                else if (mode == "IN") {
                    ele.html(data);
                }
            } else {
                document.open();
                document.write(data);
                document.close();
            }

        }
    }

    $.ajaxPostForm = function (formId, renderId, onSuccess, isOverride, isAjaxLoading) {
        var form = null;
        if(formId instanceof jQuery){
            form = formId;
        }else{
            form = $('#' + formId);
        }
        var formData = form.objectifyForm();
        var url = form.attr("action");

        if (url != null && url != "") {
            if(isAjaxLoading){
                renderLoading(renderId);
            }
            $.post(url, formData, function (data) {
                if (renderId != null && renderId != "") {
                    render(renderId, data,isOverride);
                    if(onSuccess && typeof(onSuccess)=="function"){
                        onSuccess();
                    }
                }
            });
        }
    }

    $.ajaxGet = function (url, renderId, onSuccess, isOverride, isAjaxLoading) {
        if (url != null && url != "") {
            if(isAjaxLoading){
                renderLoading(renderId);
            }
            $.get(url, function (data) {
                render(renderId, data, isOverride);
                if(onSuccess && typeof(onSuccess)=="function"){
                    onSuccess();
                }
            });
        }
    }

    $.ajaxGetForm = function (formId, renderId, onSuccess, isOverride, isAjaxLoading) {
        var form = null;
        if(formId instanceof jQuery){
            form = formId;
        }else{
            form = $('#' + formId);
        }
        var formData = form.serialize();
        var url = form.attr("action");

        if (url != null && url !== "") {
            if(isAjaxLoading){
                renderLoading(renderId);
            }
            $.get(url, formData, function (data) {
                if (renderId != null && renderId !== "") {
                    render(renderId, data, isOverride);
                }
            });
        }
    }

    function renderLoading(renderId){

        var ele = $('#' + renderId);
        var height = ele.outerHeight();
        var width = ele.outerWidth();
        var offset = ele.offset();

        var loadingObj = $('<div style="text-align: center;vertical-align: middle;width:'+width+';height:'+height+';top:'+offset.top+';left: '+offset.left+';position:absolute;z-index:9999;background-color: whitesmoke;opacity: 0.5;"><img style="width:50px;height:50px;" src="../images/ajax4p-loading.gif" /></div>');
        ele.append(loadingObj);
    }

}(jQuery));