import { memo, type FC } from "react";
import Card from "./Card";
import type { Map } from "@/features/map/domains/entities/Map";

interface Props {
  mapList: Map[];
  isClearing: boolean;
}

const Cards: FC<Props> = ({ mapList, isClearing }) => {
  return (
    <div
      className={`grid gap-3 sm:gap-4 lg:gap-6 ${mapList.length === 1 ? "grid-cols-1 max-w-md mx-auto" : "grid-cols-1 sm:grid-cols-2"}`}
    >
      {mapList.map((m) => (
        <Card key={m.id} map={m} isClearing={isClearing} />
      ))}
    </div>
  );
};

export default memo(Cards);
