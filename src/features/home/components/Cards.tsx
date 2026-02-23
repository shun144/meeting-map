import React, { memo, type FC } from "react";
import type { MapDTO } from "./Home";
import Card from "./Card";

interface Props {
  mapInfos: MapDTO[];
  isClearing: boolean;
}

const Cards: FC<Props> = ({ mapInfos, isClearing }) => {
  return (
    <div
      className={`grid gap-3 sm:gap-4 lg:gap-6 ${mapInfos.length === 1 ? "grid-cols-1 max-w-md mx-auto" : "grid-cols-1 sm:grid-cols-2"}`}
    >
      {mapInfos.map((mapInfo) => (
        <Card key={mapInfo.id} mapInfo={mapInfo} isClearing={isClearing} />
      ))}
    </div>
  );
};

export default memo(Cards);
