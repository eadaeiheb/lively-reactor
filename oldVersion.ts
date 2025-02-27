(function (ko) {
    const originalInit = ko.bindingHandlers.text.init;
    const originalUpdate = ko.bindingHandlers.text.update;
    let textId = 0;

    ko.bindingHandlers.text = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var val = ko.unwrap(valueAccessor());
            const wrapText = !element.classList || element.classList.length === 0 || !element.classList.contains("text-nowrap");

            if (val && val.value && typeof (val) === 'object') {
                var valueUnwrapped = ko.utils.unwrapObservable(val.value || val);
                if (!valueUnwrapped) {
                  return;
                }
                if (wrapText) {
                    element.style.whiteSpace = val.whiteSpace || "pre-line";
                    element.style.wordBreak = val.wordBreak || "break-word";
                }
                val.expand = !!val.expand;
                if (!val.expand) {
                    if (val.limit) {
                        ko.utils.setTextContent(element, valueUnwrapped.length > val.limit ? window.Helper.String.limitStringWithEllipses(valueUnwrapped, val.limit) : valueUnwrapped);
                    } else {
                        ko.utils.setTextContent(element, valueUnwrapped);
                    }
                    return;
                }
                val.limit = val.limit || 300;
                var toggle = document.createElement('a');
                toggle.appendChild(document.createTextNode(window.Helper.String.getTranslatedString("more")));
                toggle.href = "javascript:void(0);";
                if (!$(element).attr("id")){
                    $(element).attr("id", "text-" + ++textId);
                }
                toggle.id = "toggle-" + $(element).attr("id");
                if (element.after) {
                  element.after(toggle);
                } else {
                  element.parentElement.appendChild(toggle);
                }
            } else {
                if (element.style && wrapText) {
                    element.style.whiteSpace = "pre-line";
                    element.style.wordBreak = "break-word";
                }
                originalInit(element, valueAccessor, allBindings, viewModel, bindingContext);
            }

        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var val = ko.unwrap(valueAccessor());
            if (val && val.value && typeof (val) === 'object') {
                var valueUnwrapped = ko.utils.unwrapObservable(val.value || val);
                if (!valueUnwrapped) {
                    return;
                }
                val.expand = !!val.expand;
                if (!val.expand) {
                    if (val.limit) {
                        ko.utils.setTextContent(element, valueUnwrapped.length > val.limit ? window.Helper.String.limitStringWithEllipses(valueUnwrapped, val.limit) : valueUnwrapped);
                    } else {
                        ko.utils.setTextContent(element, valueUnwrapped);
                    }
                    return;
                }
                val.limit = val.limit || 300;
                var toggle = document.getElementById('toggle-' + $(element).attr("id"));
                var collapsed = true;
                toggle.onclick = function () {
                    collapsed = !collapsed;
                    if (collapsed) {
                        toggle.innerText = window.Helper.String.getTranslatedString("more");
                    } else {
                        toggle.innerText = " " + window.Helper.String.getTranslatedString("less");
                    }
                    ko.utils.setTextContent(element, collapsed && valueUnwrapped.length > val.limit ? window.Helper.String.limitStringWithEllipses(valueUnwrapped, val.limit) : valueUnwrapped);
                }
                toggle.style.display = valueUnwrapped.length > val.limit ? 'inline' : 'none';
                ko.utils.setTextContent(element, collapsed && valueUnwrapped.length > val.limit ? window.Helper.String.limitStringWithEllipses(valueUnwrapped, val.limit) : valueUnwrapped);
            } else {
                originalUpdate(element, valueAccessor, allBindings, viewModel, bindingContext);
            }
        }
    };
})(window.ko);