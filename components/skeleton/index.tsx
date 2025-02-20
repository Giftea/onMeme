import React, { JSXElementConstructor, ReactElement } from "react";
import { Skeleton } from "../ui/skeleton";

interface Props {
  enabled?: boolean;
  children?: ReactElement | ReactElement[];
  skeleton?: JSXElementConstructor<any>;
}

export default function LoadSkeleton({
  enabled,
  children,
  skeleton: Skeleton,
}: Props): ReactElement {
  Skeleton = Skeleton ?? DefaultSkeleton;
  return <>{!!enabled ? <Skeleton /> : children}</>;
}

const DefaultSkeleton = () => <Skeleton className="h-screen w-full " />;
