import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TextElement } from "@/lib/types/index";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Settings } from "lucide-react";

type Props = {
  addNewTextField: () => void;
  removeTextField: (id: string) => void;
  updateTextField: (id: string, key: string, value: string | number) => void;
  textElements: TextElement[];
};

const MemeCaptionInput = ({
  addNewTextField,
  removeTextField,
  updateTextField,
  textElements,
}: Props) => {
  return (
    <div className="border rounded-lg p-4 my-3 space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Meme Texts</h2>
        <Button onClick={addNewTextField} variant={"outline"}>
          + Add Text
        </Button>
      </div>

      <div className="space-y-4 max-h-80 md:max-h-96 overflow-y-auto pr-1">
        {textElements.map((textElement, index) => (
          <div key={textElement.id} className={"p-3 border rounded"}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Text #{index + 1}</h3>
              {index > 0 && (
                <button
                  onClick={() => removeTextField(textElement.id)}
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="flex justify-between items-center">
              <Input
                type="text"
                value={textElement.text}
                onChange={(e) =>
                  updateTextField(textElement.id, "text", e.target.value)
                }
                placeholder="Enter text"
                className="w-full py-4 mr-2"
              />

              <Popover>
                <PopoverTrigger>
                  <Settings />
                </PopoverTrigger>
                <PopoverContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm mb-1">
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
                      <label className="block text-sm mb-1">Font Family:</label>
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
                      <label className="block text-sm mb-1">Text Color:</label>
                      <input
                        type="color"
                        value={textElement.fontColor}
                        onChange={(e) =>
                          updateTextField(
                            textElement.id,
                            "fontColor",
                            e.target.value
                          )
                        }
                        className="w-full h-8 rounded cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1">
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
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemeCaptionInput;
