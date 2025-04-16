// from https://github.com/thread-pond/signature-pad/issues/94#issuecomment-25021226
interface signaturePadOptions {
	/**
	 * The defaultAction Default: typeIt. - Other values: drawIt - how the object is initialized, does it allow typing by default or drawing by default?
	 */
	defaultAction?: string;
	/**
	 * Default: false   - creates a simpler version that displays only. Skips all the bindings
	 */
	displayOnly?: boolean;
	/**
	 * Default: false   - if true, the user cannot type their signature, they must draw it
	 */
	drawOnly?: boolean;
	/**
	 * Default: canvas  - Representing a JQuery selector, The canvas element from inside the form
	 */
	canvas?: string;
	/**
	 * Default: .sig    - Representing a JQuery selector, All the parts of the signature form that require javascript. (hidden by default)
	 */
	sig?: string;
	/**
	 * Default: .sigNav - Representing a JQuery selector, The TypeIt/DrawIt navigation (hidden by default)
	 */
	sigNav?: string;
	/**
	 * Default: #fff. Represents a CSS colour. {bgColour: 'transparent'} is allowed
	 */
	bgColour?: string;
	/**
	 * Default: #145394
	 */
	penColour?: string;
	/**
	 * Default: 2, must be an integer
	 */
	penWidth?: number;
	/**
	 * Default: round. Other Values: butt, square Determines how the end points of each line are drawn.
	 */
	penCap?: string;
	/**
	 * Default: #ccc
	 */
	lineColour?: string;
	/**
	 * Default: 2, must be an integer, this is the width of the signature line. Set to 0 to make it invisible.
	 */
	lineWidth?: number;
	/**
	 * Default: 2, must be an integer, margin on the left and right of the signature line
	 */
	lineMargin?: number;
	/**
	 * Default: 35, must be an integer. I find that having it set to about 2/3 of the height is about right
	 */
	lineTop?: number;
	/**
	 * Default: .name        - representing a JQuery selector, The input field for typing a name
	 */
	name?: string;
	/**
	 * Default: .typed       - representing a JQuery selector, the HTML element to display the printed name
	 */
	typed?: string;
	/**
	 * Default: .clearButton - representing a JQuery selector, the button/link for clearing the canvas
	 */
	clear?: string;
	/**
	 * Default: typeIt a     - representing a JQuery selector, the button/tab to trigger the typeIt state
	 */
	typeIt?: string;
	/**
	 *  Default: drawIt a     - representing a JQuery selector, the button/tab to trigger the drawIt state
	 */
	drawIt?: string;
	/**
	 * Default: .typeItDesc  - representing a JQuery selector, the description for the typeIt state
	 */
	typeItDesc?: string;
	/**
	 * Default: .drawItDesc  - representing a JQuery selector, the description for the drawIt state
	 */
	drawItDesc?: string;
	/**
	 * Default: .output      - representing a JQuery selector, the hidden input field for remembering the signature's JSON array
	 */
	output?: string;
	/**
	 * Default: current      - representing a valid CSS class name,  used to mark items as being currently active. Used for the typeIt/drawIt tabs and canvas wrapper element
	 */
	currentClass?: string;
	/**
	 *  validateFields:  Default: true         - should the name and sig pad fields be validate for completeness?
	 */
	validateFields?: boolean;
	/**
	 * Default: error        - representing a valid CSS class name, used for error message displayed on invalid submission
	 */
	errorClass?: string;
	/**
	 * Default: Please enter your name - the error displayed on invalid submission
	 */
	errorMessage?: string;
	/**
	 * Default: Please sign the document - the error displayed when in drawOnly: true and no signature drawn
	 */
	errorMessageDraw?: string;
	/**
	 * Default: (builtin), pass function to be executed before the form is validated. Can be used to clear old validation errors.
	 *    context: a jQuery object representing the selected element to initialize the signature pad
	 *    settings: the signature pad settings object
	 */
	onBeforeValidate?: (context: JQuery, settings: JQuery) => void;
	/**
	 * Default: (builtin), passa function callback to be executed when the form is invalid. Can be used to display error message.
	 */
	onFormError?: (errors: any, context: JQuery, settings: JQuery) => void;
	/**
	 * Default: null, a function callback to be executed every time the user draws a new segment in their signature
	 */
	onDraw?: () => void;
	/**
	 *  Default: null, a function callback to be executed every time the user completes their drawing segment
	 */
	onDrawEnd?: () => void;
}
interface signaturePadLineSegment {
	/**
	 *
	 */
	lx: number // integer
	/**
	 *
	 */
	ly: number; //integer
	/**
	 *
	 */
	mx: number; // integer
	/**
	 *
	 */
	xy: number; // integer
}

interface JQuery {
	/**
	 * Setup a Signature pad (called API in the signaturePad documentation)
	 * and connect it to UI elements
	 * @param options {signaturePadOptions} the options, including names of UI elements if not default
	 */
	signaturePad(
		options: signaturePadOptions
	): SignaturePad; // returns a signaturePad object, called API in the signaturePad documentation
	/**
	 * Setup and return a Signature pad (called API in the signaturePad documentation)
	 * and connect it to UI elements using all defaults.
	 * Very unlikely you will ever use this format, usually at least one thing needs to be changed
	 */
	signaturePad(): SignaturePad; // returns a signaturePad object, called API in the signaturePad documentation
}

interface SignaturePad extends JQuery {

	/**
	 * Return the signature for this signaturePad as a row of line segments, each a signaturePadLineSegment
	 */
	getSignature(): signaturePadLineSegment[];
	/**
	 * Return the signature for this signaturePad as a string that is a set of line segments, a JSON, follows this format: [{"lx":20,"ly":34,"mx":20,"my":34},…]
	 */
	getSignatureString(): string;

	/**
	 * Return the signature for this signaturePad as a Base64 encoded PNG of the canvas
	 */
	getSignatureImage(): string; //
	/**
	 * Draw/ReDraw the canvas using the array of line segments, all of type signaturePadLineSegment
	 */
	regenerate(paths: signaturePadLineSegment[]): void;
	/**
	 * Draw/Redraw the canvas using a string that is a set of line segments, a JSON, follows this format: [{"lx":20,"ly":34,"mx":20,"my":34},…]
	 */
	regenerate(paths: string) : void;

	/**
	 * Clear the canvas to allow the signature to be reentered
	 */
	clearCanvas(): void;

	/**
	 * Update a SignaturePad with new options
	 * @param options {signaturePadOptions} the options, including names of UI elements if not default
	 */

	updateOptions(options: signaturePadOptions) : void;
	/**
	 * Return whether the form has the required data entered
	 */
	validateForm(): boolean;


}