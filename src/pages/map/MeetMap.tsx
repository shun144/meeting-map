import { createDestinationMarker } from "@/components/map/destination/DestinationMarker";
import { Destination } from "@/domains/Destination";
import { DestinationMarker } from "@/presentations/map/DestinationMarker";
import { mabashiStyle } from "@/hooks/map/mabashiStyle";
import { fetchAllDestination } from "@/lib/supabase/supabaseFunction";
import { DestinationRepository } from "@/repositories/DestinationRepository";
import maplibregl from "maplibre-gl";
import { PMTiles, Protocol } from "pmtiles";
import type React from "react";
import { useEffect, useRef, useState, type FC } from "react";
import { useParams } from "react-router";

const PMTILES_URL =
  "https://nwmuhxuprqnikmbcwteo.supabase.co/storage/v1/object/public/public-maps/mabashi.pmtiles";

type Props = React.ComponentProps<"div">;

const isMarker = (target: EventTarget | null): target is SVGAElement => {
  return !!(target as HTMLElement).closest(".maplibregl-marker");
};

const MeetMap: FC<Props> = ({ className = "flex-1" }) => {
  const { mapId } = useParams();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);

  const [destinationMarkers, setDestinationMarkers] = useState<
    DestinationMarker[]
  >([]);

  useEffect(() => {
    (async () => {
      const repo = new DestinationRepository(mapId);
      const fetchedDestinations = await repo.findAll();
      const data = fetchedDestinations.map((x) => new DestinationMarker(x));
      setDestinationMarkers(data);
    })();

    if (!mapContainerRef.current) return;

    const protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    const pmtiles = new PMTiles(PMTILES_URL);
    protocol.add(pmtiles);

    const mapInstance = new maplibregl.Map({
      container: mapContainerRef.current,
      center: [139.918839, 35.815512],
      zoom: 18,
      maxZoom: 20,
      minZoom: 15,
      style: mabashiStyle,
      doubleClickZoom: false,
    });

    mapInstance.on("load", () => {
      setMap(mapInstance);
    });

    mapInstance.on("click", (event) => {
      if (isMarker(event.originalEvent.target)) return;

      const newDestination = new Destination(0, event.lngLat, "");
      const newDestinationMarker = new DestinationMarker(newDestination);
      newDestinationMarker.dom.addTo(mapInstance);
      setTimeout(() => newDestinationMarker.dom.togglePopup(), 0);
    });

    // mapInstance.on("touchend", (e) => {
    //   alert(e.lngLat);
    // });

    // mapInstance.on("click", (event) => {
    //   if (isMarker(event.originalEvent.target)) return;

    //   const newDestination = new Destination(0, event.lngLat, "");
    //   const { marker, cleanup } = createDestinationMarker({
    //     destination: newDestination,
    //     setDestinations,
    //   });
    //   marker.addTo(mapInstance);
    //   marker.togglePopup();
    //   cleanups.push({ cleanup });
    // });

    // mapInstance.on("contextmenu", async (event) => {
    //   const eventTarget = event.originalEvent.target;
    //   if (isMarker(eventTarget)) {
    //     const targetId = eventTarget
    //       .closest(".maplibregl-marker")!
    //       .getAttribute("data-destination-id");

    //     const id = parseInt(targetId ?? "0");
    //     if (id === 0) return;
    //     setDestinations((prev) => prev.filter((x) => x.id !== id));

    //     const repo = new DestinationRepository();
    //     await repo.delete(id);
    //   }
    // });

    return () => {
      mapInstance.remove();
      destinationMarkers.forEach((marker) => marker.cleanup());
    };
  }, []);

  useEffect(() => {
    // マップと目的地情報の両方がある場合にのみマーカー追加処理を行う
    if (!map || destinationMarkers.length === 0) return;
    destinationMarkers.forEach((marker) => marker.dom.addTo(map));

    return () => {
      destinationMarkers.forEach((marker) => marker.cleanup());
    };
  }, [map, destinationMarkers]);

  // useEffect(() => {
  //   // マップと目的地情報の両方がある場合にのみマーカー追加処理を行う
  //   if (!map || !destinations) return;

  //   const cleanups: Array<{ cleanup: () => void }> = [];

  //   destinations.forEach((destination) => {
  //     const destinationMarker = new DestinationMarker(destination);

  //     // const { marker, cleanup } = createDestinationMarker({
  //     //   destination,
  //     //   setDestinations,
  //     // });
  //     destinationMarker.dom.addTo(map);
  //     // cleanups.push({ cleanup });
  //   });

  //   return () => cleanups.forEach(({ cleanup }) => cleanup());
  // }, [map, destinations]);

  return (
    <div className={className}>
      <div ref={mapContainerRef} className="h-full w-full" />;
    </div>
  );
};

export default MeetMap;

// import { createDestinationMarker } from "@/components/map/destination/DestinationMarker";
// import { Destination } from "@/domains/Destination";
// import { mabashiStyle } from "@/hooks/map/mabashiStyle";
// import { fetchAllDestination } from "@/lib/supabase/supabaseFunction";
// import { DestinationRepository } from "@/repositories/DestinationRepository";
// import maplibregl from "maplibre-gl";
// import { PMTiles, Protocol } from "pmtiles";
// import type React from "react";
// import { useEffect, useRef, useState, type FC } from "react";
// import { useParams } from "react-router";

// type Props = React.ComponentProps<"div">;

// const isMarker = (target: EventTarget | null): target is SVGAElement => {
//   return !!(target as HTMLElement).closest(".maplibregl-marker");
// };

// const Map: FC<Props> = ({ className = "flex-1" }) => {
//   const [map, setMap] = useState<maplibregl.Map | null>(null);
//   const [destinations, setDestinations] = useState<Destination[]>([]);
//   const mapContainerRef = useRef<HTMLDivElement>(null);

//   const { mapId } = useParams();

//   useEffect(() => {
//     (async () => {
//       const repo = new DestinationRepository(mapId);
//       const res = await repo.findAll();
//       // const res = await fetchAllDestination();
//       setDestinations(res);
//     })();

//     if (!mapContainerRef.current) return;

//     const PMTILES_URL =
//       "https://nwmuhxuprqnikmbcwteo.supabase.co/storage/v1/object/public/public-maps/mabashi.pmtiles";

//     const protocol = new Protocol();
//     maplibregl.addProtocol("pmtiles", protocol.tile);
//     const pmtiles = new PMTiles(PMTILES_URL);
//     protocol.add(pmtiles);

//     const mapInstance = new maplibregl.Map({
//       container: mapContainerRef.current,
//       center: [139.918839, 35.815512],
//       zoom: 18,
//       maxZoom: 20,
//       minZoom: 15,
//       style: mabashiStyle,
//       doubleClickZoom: false,
//     });

//     mapInstance.on("load", () => {
//       setMap(mapInstance);
//     });

//     const cleanups: Array<{ cleanup: () => void }> = [];

//     // mapInstance.on("touchend", (e) => {
//     //   alert(e.lngLat);
//     // });

//     mapInstance.on("click", (event) => {
//       if (isMarker(event.originalEvent.target)) return;

//       const newDestination = new Destination(0, event.lngLat, "");
//       const { marker, cleanup } = createDestinationMarker({
//         destination: newDestination,
//         setDestinations,
//       });
//       marker.addTo(mapInstance);
//       marker.togglePopup();
//       cleanups.push({ cleanup });
//     });

//     mapInstance.on("contextmenu", async (event) => {
//       const eventTarget = event.originalEvent.target;
//       if (isMarker(eventTarget)) {
//         const targetId = eventTarget
//           .closest(".maplibregl-marker")!
//           .getAttribute("data-destination-id");

//         const id = parseInt(targetId ?? "0");
//         if (id === 0) return;
//         setDestinations((prev) => prev.filter((x) => x.id !== id));

//         const repo = new DestinationRepository();
//         await repo.delete(id);
//       }
//     });

//     return () => {
//       mapInstance.remove();
//       cleanups.forEach(({ cleanup }) => cleanup());
//     };
//   }, []);

//   useEffect(() => {
//     // マップと目的地情報の両方がある場合にのみマーカー追加処理を行う
//     if (!map || !destinations) return;

//     const cleanups: Array<{ cleanup: () => void }> = [];

//     destinations.forEach((destination) => {
//       const { marker, cleanup } = createDestinationMarker({
//         destination,
//         setDestinations,
//       });
//       marker.addTo(map);
//       cleanups.push({ cleanup });
//     });

//     return () => cleanups.forEach(({ cleanup }) => cleanup());
//   }, [map, destinations]);

//   return (
//     <div className={className}>
//       <div ref={mapContainerRef} className="h-full w-full" />;
//     </div>
//   );
// };

// export default Map;
