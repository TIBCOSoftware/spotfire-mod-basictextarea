import { DataView, ModProperty } from "spotfire-api";
//import * as marked from "marked";
import * as DOMPurify from "dompurify";
import * as commonmark from "commonmark";

const Spotfire = window.Spotfire;
const DEBUG = true;

Spotfire.initialize(async (mod) => {
    const reader = mod.createReader(mod.visualization.data(), mod.windowSize(), mod.property("text"));

    reader.subscribe(generalErrorHandler(mod)(onChange), (err) => {
        mod.controls.errorOverlay.show(err);
    });

    let lastCommitedText = "";

    // get pointers to elements
    const helpDiv = <HTMLDivElement>document.getElementById("help");
    const textEditor = <HTMLDivElement>document.getElementById("text-editor");
    const textEditorInput = <HTMLTextAreaElement>document.getElementById("text-editor-input");
    const savebutton = <HTMLButtonElement>document.getElementById("savebutton");
    const cancelbutton = <HTMLButtonElement>document.getElementById("cancelbutton");
    const textDisplay = <HTMLDivElement>document.getElementById("text-display");

    helpDiv.addEventListener("dblclick", function (event) {
        if (mod.getRenderContext().isEditing) {
            helpDiv.style.display = "none";
            textDisplay.style.display = "none";
            textEditor.style.display = "flex";
        }
    });

    savebutton.addEventListener("click", function (event) {
        // Store the current text in a mod property
        let inputText = textEditorInput.value;
        mod.property("text").set(inputText);
        lastCommitedText = inputText;
        updateDisplay(inputText);

        textEditor.style.display = "none";
        if (inputText) textDisplay.style.display = "block";
        else helpDiv.style.display = "flex";
    });

    cancelbutton.addEventListener("click", function (event) {
        textEditorInput.value = lastCommitedText;
        textEditor.style.display = "none";

        if (lastCommitedText) {
            helpDiv.style.display = "none";
            textDisplay.style.display = "block";
        } else {
            textDisplay.style.display = "none";
            helpDiv.style.display = "flex";
        }
    });

    textDisplay.addEventListener("dblclick", function (event) {
        if (mod.getRenderContext().isEditing) {
            textDisplay.style.display = "none";
            textEditor.style.display = "flex";
        }
    });

    async function onChange(dataView: DataView, windowSize: Spotfire.Size, textProperty: ModProperty<string>) {
        const context = mod.getRenderContext();

        document.querySelector("#extra_styling")!.innerHTML = `
        .displaytext { fill: ${context.styling.general.font.color}; font-size: ${context.styling.general.font.fontSize}px; font-weight: ${context.styling.general.font.fontWeight}; font-style: ${context.styling.general.font.fontStyle};}
        svg { stroke: ${context.styling.general.font.color}; fill: ${context.styling.general.font.color}}t
        `;

        // Update input field and display field
        let text = textProperty!.value() || "";
        updateDisplay(text);

        if (text || !mod.getRenderContext().isEditing) {
            helpDiv.style.display = "none";
            textDisplay.style.display = "block";
        } else {
            textDisplay.innerHTML = "";
            textDisplay.style.display = "none";
            helpDiv.style.display = "flex";
        }

        context.signalRenderComplete();
    }

    function updateDisplay(text: string) {
        lastCommitedText = textEditorInput.value;
        textEditorInput.value = text;

        // convert text to HTML
        let reader = new commonmark.Parser();
        var writer = new commonmark.HtmlRenderer();
        var parsed = reader.parse(text);
        var rawHTML = writer.render(parsed);
        let cleanhtml = DOMPurify.sanitize(rawHTML, { USE_PROFILES: { html: true, svg: true } });
        textDisplay.innerHTML = cleanhtml;
    }
});

/**
 * subscribe callback wrapper with general error handling, row count check and an early return when the data has become invalid while fetching it.
 *
 * The only requirement is that the dataview is the first argument.
 * @param mod - The mod API, used to show error messages.
 * @param rowLimit - Optional row limit.
 */
export function generalErrorHandler<T extends (dataView: Spotfire.DataView, ...args: any) => any>(
    mod: Spotfire.Mod,
    rowLimit = 2000
): (a: T) => T {
    return function (callback: T) {
        return async function callbackWrapper(dataView: Spotfire.DataView, ...args: any) {
            try {
                const errors = await dataView.getErrors();
                if (errors.length > 0) {
                    mod.controls.errorOverlay.show(errors, "DataView");
                    return;
                }
                mod.controls.errorOverlay.hide("DataView");

                /**
                 * Hard abort if row count exceeds an arbitrary selected limit
                 */
                const rowCount = await dataView.rowCount();
                if (rowCount && rowCount > rowLimit) {
                    mod.controls.errorOverlay.show(
                        `☹️ Cannot render - too many rows (rowCount: ${rowCount}, limit: ${rowLimit}) `,
                        "General"
                    );
                    return;
                }

                /**
                 * User interaction while rows were fetched. Return early and respond to next subscribe callback.
                 */
                const allRows = await dataView.allRows();
                if (allRows == null) {
                    return;
                }

                await callback(dataView, ...args);

                mod.controls.errorOverlay.hide("General");
            } catch (e) {
                if (e instanceof Error) {
                    mod.controls.errorOverlay.show(e.message, "General");

                    if (DEBUG) {
                        throw e;
                    }
                }
            }
        } as T;
    };
}
