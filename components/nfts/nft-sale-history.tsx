import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { shortenAddress } from "@/lib/utils";
import Link from "next/link";

interface Transfer {
  id: number;
  seller: string;
  buyer: string;
  price: number;
  transferredAt: string | null;
}

interface PreviousOwnersAccordionProps {
  transfers: Transfer[];
}

export function PreviousOwnersAccordion({
  transfers,
}: PreviousOwnersAccordionProps) {
  return (
    <Accordion
    defaultValue="history"
      type="single"
      collapsible
      className="w-full bg-card border px-4 rounded-lg my-6"
    >
      <AccordionItem value="history">
        <AccordionTrigger className="text-lg hover:no-underline font-semibold border-b">
          NFT Ownership History
        </AccordionTrigger>
        <AccordionContent>
          {transfers.length === 0 ? (
            <p>No previous owners found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse rounded-lg">
                <thead>
                  <tr className="border-b">
                    <th className=" p-2 py-4 text-left">Previous Owner</th>
                    <th className=" p-2 py-4 text-left">New Owner</th>
                    <th className=" p-2 py-4 text-left">Price</th>
                    <th className=" p-2 py-4 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transfers.map((transfer) => (
                    <tr key={transfer.id} className="">
                      <td className=" p-2">
                        <Link className="text-primary" href={`/user/${transfer.seller}`}>
                          {shortenAddress(transfer.seller)}
                        </Link>
                      </td>
                      <td className=" p-2">
                        <Link className="text-primary" href={`/user/${transfer.buyer}`}>
                          {shortenAddress(transfer.buyer)}
                        </Link>
                      </td>
                      <td className=" p-2">{transfer.price} OMC</td>
                      <td className=" p-2">
                        {transfer?.transferredAt &&
                          new Date(
                            transfer?.transferredAt
                          ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
