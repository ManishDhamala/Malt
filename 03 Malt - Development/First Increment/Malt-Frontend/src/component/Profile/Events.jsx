import React from "react";
import { EventCard } from "./EventCard";

export const Events = () => {
  return (
    <div className="lg:mt-25 px-5 flex flex-wrap gap-5">
      {[1, 1, 1].map((item) => (
        <EventCard />
      ))}
    </div>
  );
};
