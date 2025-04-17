import React from "react";
import { ProfileNavigation } from "./ProfileNavigation";
import { Route, Routes } from "react-router-dom";
import { UserProfile } from "./UserProfile";
import { Orders } from "./Orders";
import { Address } from "./Address";
import { Favorites } from "./Favorites";
import { Events } from "./Events";
import { PrivateRoute } from "../../Routers/PrivateRoute";
import PaymentHistory from "./PaymentHistory";
import { CustomerEvents } from "./CustomerEvents";

export const Profile = () => {
  return (
    <PrivateRoute>
      <div className="lg:flex justify-between">
        <div className="sticky h-[10vh] lg:h-[80vh] lg:w-[20%]">
          <ProfileNavigation />
        </div>
        <div className="lg:w-[80%]">
          <Routes>
            <Route path="/" element={<UserProfile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/address" element={<Address />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/events" element={<CustomerEvents />} />
            <Route path="/payment" element={<PaymentHistory />} />
          </Routes>
        </div>
      </div>
    </PrivateRoute>
  );
};
