import { CSAConnection } from "./ConnectionScanAlgorithm";
import {
  DatabaseTrainConnection,
  MongooseTrainConnection,
} from "../../../services/database/model/MongooseTrainConnection";
import {
  DatabaseTrainStation,
  MongooseTrainStation,
} from "../../../services/database/model/MongooseTrainStation";

import { TrainJourney } from "@model";

const SECONDS_PER_DAY = 24 * 60 * 60;

const getConnections = async (): Promise<TrainJourney[]> => {
  const connections = (await MongooseTrainConnection.find().sort({
    "trainStops.departureTime": 1,
  })) as DatabaseTrainConnection[];

  console.log("connections", connections.length);

  const mappedConnections = await Promise.all(
    connections.map(async ({ trainId, trainType, trainStops }) => {
      return {
        trainId,
        trainType,
        stops: await Promise.all(
          trainStops.map(async (stop) => {
            const { stationId, departureTime, arrivalTime, track } = stop;

            const station = (await MongooseTrainStation.findById(stationId)) as DatabaseTrainStation;

            return {
              stationId: station.csaIndex,
              stationName: station.name,
              arrivalTime,
              departureTime,
              track,
            };
          })
        ),
      };
    })
  );

  const test = mappedConnections.map((connection) => {
    const nextDayConnection = {
      ...connection,
      stops: connection.stops.map((stop) => ({
        ...stop,
        arrivalTime: stop.arrivalTime + SECONDS_PER_DAY,
        departureTime: stop.departureTime + SECONDS_PER_DAY,
      })),
    };

    return [connection, nextDayConnection];
  });
  
  return test.flat(1);
};

export const transformTrainJourneys = async (): Promise<CSAConnection[]> => {
  const connections = await getConnections();

  const journeys = connections.map((trainJourney) => {
    const { stops } = trainJourney;

    return stops
      .map((currentStop, index) => {
        if (index === stops.length - 1) {
          return null;
        }

        const nextStop = stops[index + 1];

        return {
          trainId: trainJourney.trainId,
          departureStation: currentStop.stationId,
          departureTrackId: currentStop.track,
          arrivalStation: nextStop.stationId,
          arrivalTrackId: nextStop.track,
          departureTimestamp: currentStop.departureTime,
          arrivalTimestamp: nextStop.arrivalTime,
        };
      })
      .filter((connection) => connection !== null) as CSAConnection[];
  });

  return journeys.reduce((acc, line) => [...acc, ...line], []);
};
