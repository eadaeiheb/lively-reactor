
(function (ko) {
    const originalInit = ko.bindingHandlers.text.init;
    const originalUpdate = ko.bindingHandlers.text.update;
    let textId = 0;

    ko.bindingHandlers.text = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var val = ko.unwrap(valueAccessor());
            const wrapText = !element.classList || element.classList.length === 0 || !element.classList.contains("text-nowrap");

            if (val && val.value && typeof (val) === 'object') {
                var valueUnwrapped = ko.utils.unwrapObservable(val.value);
                if (!valueUnwrapped) {
                  return;
                }
                if (wrapText) {
                    element.style.whiteSpace = val.whiteSpace || "pre-line";
                    element.style.wordBreak = val.wordBreak || "break-word";
                }
                
                // Ensure element has an ID
                if (!element.id) {
                    element.id = "text-" + ++textId;
                }
                
                val.expand = !!val.expand;
                if (!val.expand) {
                    ko.utils.setTextContent(element, valueUnwrapped);
                    return;
                }
                
                val.limit = val.limit || 300;
                
                // Remove existing toggle if any
                const existingToggle = document.getElementById("toggle-" + element.id);
                if (existingToggle) {
                    existingToggle.remove();
                }
                
                // Create new toggle
                var toggle = document.createElement('a');
                toggle.appendChild(document.createTextNode(window.Helper.String.getTranslatedString("more")));
                toggle.href = "javascript:void(0);";
                toggle.id = "toggle-" + element.id;
                
                if (element.after) {
                  element.after(toggle);
                } else {
                  element.parentElement.appendChild(toggle);
                }
                
                // Track collapsed state with the value object
                val.collapsed = true;
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
                var valueUnwrapped = ko.utils.unwrapObservable(val.value);
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
                val.collapsed = val.collapsed !== undefined ? val.collapsed : true;
                
                var toggle = document.getElementById('toggle-' + element.id);
                if (!toggle) return;
                
                toggle.style.display = valueUnwrapped.length > val.limit ? 'inline' : 'none';
                
                // Use a consistent toggle click handler
                toggle.onclick = function () {
                    val.collapsed = !val.collapsed;
                    
                    if (val.collapsed) {
                        toggle.innerText = window.Helper.String.getTranslatedString("more");
                    } else {
                        toggle.innerText = window.Helper.String.getTranslatedString("less");
                    }
                    
                    ko.utils.setTextContent(
                        element,
                        val.collapsed && valueUnwrapped.length > val.limit
                            ? window.Helper.String.limitStringWithEllipses(valueUnwrapped, val.limit)
                            : valueUnwrapped
                    );
                };
                
                // Set initial content based on collapsed state
                ko.utils.setTextContent(
                    element,
                    val.collapsed && valueUnwrapped.length > val.limit
                        ? window.Helper.String.limitStringWithEllipses(valueUnwrapped, val.limit)
                        : valueUnwrapped
                );
                
                // Update toggle text
                toggle.innerText = val.collapsed
                    ? window.Helper.String.getTranslatedString("more")
                    : window.Helper.String.getTranslatedString("less");
            } else {
                originalUpdate(element, valueAccessor, allBindings, viewModel, bindingContext);
            }
        }
    };
})(window.ko);
