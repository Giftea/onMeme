import React from "react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import Image from "next/image";
import { Meme } from "@/lib/types/index";

type Props = {
  loading: boolean;
  memes: Meme[];
  selectedMeme: Meme | null;
  selectedMemeId: string | null;
  handleMemeClick: (meme: Meme) => void;
};

const MemeSelection = ({
  loading,
  handleMemeClick,
  memes,
  selectedMeme,
  selectedMemeId,
}: Props) => {
  return (
    <React.Fragment>
      <p className="text-lg font-semibold capitalize border-b my-4">
        {selectedMeme ? selectedMeme.name : "Select a meme template"}
      </p>
      <ScrollArea className="w-120 whitespace-nowrap rounded-md border">
        {loading ? (
          <p>Loading memes...</p>
        ) : (
          <div className="flex w-max space-x-4 p-4">
            {memes.map((meme) => (
              <figure
                key={meme.id}
                className={`border cursor-pointer rounded-lg p-2 transition-all ${
                  selectedMemeId === meme.id && "border-primary"
                }`}
                onClick={() => handleMemeClick(meme)}
              >
                <div className="overflow-hidden">
                  <Image
                    className="aspect-[3/4] h-fit w-fit object-cover"
                    width={50}
                    height={150}
                    src={meme.url}
                    alt={meme.name}
                  />
                </div>
              </figure>
            ))}
          </div>
        )}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </React.Fragment>
  );
};

export default MemeSelection;
