import React from "react";
import { cn } from "@/lib/utils";
import { TextElement } from "@/lib/types/index";

type Props = {
  addNewTextField: () => void;
  removeTextField: (id: string) => void;
  updateTextField: (id: string, key: string, value: string | number) => void;
  textElements: TextElement[];
  selectedTextId: string | null;
  setSelectedTextId: React.Dispatch<React.SetStateAction<string | null>>;
};

const MemeCaptionInput = ({
  addNewTextField,
  removeTextField,
  updateTextField,
  textElements,
  selectedTextId,
  setSelectedTextId,
}: Props) => {
  return (
    <div className="border rounded-lg p-4 my-3 space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Text Elements</h2>
        <button
          onClick={addNewTextField}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
        >
          + Add Text
        </button>
      </div>

      <div className="space-y-4 max-h-80 md:max-h-96 overflow-y-auto pr-1">
        {textElements.map((textElement, index) => (
          <div
            key={textElement.id}
            className={cn("p-3 border rounded  ", {
              "border-blue-400 bg-blue-50": textElement.id === selectedTextId,
            })}
            onClick={() => setSelectedTextId(textElement.id)}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Text #{index + 1}</h3>
              {index > 0 && (
                <button
                  onClick={() => removeTextField(textElement.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>

            <input
              type="text"
              value={textElement.text}
              onChange={(e) =>
                updateTextField(textElement.id, "text", e.target.value)
              }
              placeholder="Enter text"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Font Size: {textElement.fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="120"
                  value={textElement.fontSize}
                  onChange={(e) =>
                    updateTextField(
                      textElement.id,
                      "fontSize",
                      Number(e.target.value)
                    )
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Font Family:
                </label>
                <select
                  value={textElement.fontFamily}
                  onChange={(e) =>
                    updateTextField(
                      textElement.id,
                      "fontFamily",
                      e.target.value
                    )
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Impact">Impact</option>
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Comic Sans MS">Comic Sans MS</option>
                  <option value="Times New Roman">Times New Roman</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Font Color:
                </label>
                <input
                  type="color"
                  value={textElement.fontColor}
                  onChange={(e) =>
                    updateTextField(textElement.id, "fontColor", e.target.value)
                  }
                  className="w-full h-8 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Stroke Color:
                </label>
                <input
                  type="color"
                  value={textElement.strokeColor}
                  onChange={(e) =>
                    updateTextField(
                      textElement.id,
                      "strokeColor",
                      e.target.value
                    )
                  }
                  className="w-full h-8 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemeCaptionInput;
