(function (ko) {
	const originalInit = ko.bindingHandlers.text.init;
	const originalUpdate = ko.bindingHandlers.text.update;

	function generateUniqueId(element) {
		return element.id || "content-" + Math.random().toString(36).substr(2, 9);
	}

	function createToggle(elementId, limit, toggleClickHandler) {
		const toggle = document.createElement('a');
		toggle.id = `toggle-${elementId}`;
		toggle.href = "javascript:void(0);";
		toggle.textContent = window.Helper.String.getTranslatedString("more");
		toggle.style.marginLeft = "5px";
		toggle.addEventListener("click", toggleClickHandler);
		return toggle;
	}

	ko.bindingHandlers.text = {
		init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
			const val = ko.unwrap(valueAccessor());
			const wrapText = !element.classList || element.classList.length === 0 || !element.classList.contains("text-nowrap");

			if (val && val.value && typeof val === "object") {
				const valueUnwrapped = ko.utils.unwrapObservable(val.value);
				if (!valueUnwrapped) return;

				if (wrapText) {
					element.style.whiteSpace = val.whiteSpace || "pre-line";
					element.style.wordBreak = val.wordBreak || "break-word";
				}

				const uniqueId = generateUniqueId(element);
				element.id = uniqueId;

				const existingToggle = document.getElementById(`toggle-${uniqueId}`);
				if (existingToggle) existingToggle.remove();

				if (!val.expand) {
					ko.utils.setTextContent(element, valueUnwrapped);
					return;
				}

				val.limit = val.limit || 300;

				const toggleClickHandler = function () {
					val.collapsed = !val.collapsed;
					const isCollapsed = val.collapsed;

					document.getElementById(`toggle-${uniqueId}`).textContent = isCollapsed
						? window.Helper.String.getTranslatedString("more")
						: window.Helper.String.getTranslatedString("less");

					ko.utils.setTextContent(
						element,
						isCollapsed && valueUnwrapped.length > val.limit
							? window.Helper.String.limitStringWithEllipses(valueUnwrapped, val.limit)
							: valueUnwrapped
					);
				};

				const toggle = createToggle(uniqueId, val.limit, toggleClickHandler);
				element.after(toggle);
			} else {
				if (element.style && wrapText) {
					element.style.whiteSpace = "pre-line";
					element.style.wordBreak = "break-word";
				}
				originalInit(element, valueAccessor, allBindings, viewModel, bindingContext);
			}
		},

		update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
			const val = ko.unwrap(valueAccessor());

			if (val && val.value && typeof val === "object") {
				const valueUnwrapped = ko.utils.unwrapObservable(val.value);
				if (!valueUnwrapped) return;

				val.expand = !!val.expand;
				val.limit = val.limit || 300;
				val.collapsed = val.collapsed !== undefined ? val.collapsed : true;

				const uniqueId = element.id;
				const toggle = document.getElementById(`toggle-${uniqueId}`);

				if (!toggle) return;

				toggle.style.display = valueUnwrapped.length > val.limit ? "inline" : "none";
				ko.utils.setTextContent(
					element,
					val.collapsed && valueUnwrapped.length > val.limit
						? window.Helper.String.limitStringWithEllipses(valueUnwrapped, val.limit)
						: valueUnwrapped
				);

				toggle.textContent = val.collapsed
					? window.Helper.String.getTranslatedString("more")
					: window.Helper.String.getTranslatedString("less");
			} else {
				originalUpdate(element, valueAccessor, allBindings, viewModel, bindingContext);
			}
		}
	};
})(window.ko);
