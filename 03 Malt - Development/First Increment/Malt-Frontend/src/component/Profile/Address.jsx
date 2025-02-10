import React from "react";
import { AddressCard } from "../Cart/AddressCard";

export const Address = () => {
  return (
    <div className="lg:mt-22">
      <h1 className="py-5 text-xl font-semibold text-center">My Address</h1>
      <div className="flex flex-wrap gap-3 justify-center">
        {[1, 1, 1].map((item, index) => (
          <AddressCard
            key={index}
            showButton={true}
            item={item}
            handleSelectAddress={() => {}}
          />
        ))}
      </div>
    </div>
  );
};
