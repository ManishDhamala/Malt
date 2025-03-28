import React, { useEffect } from "react";
import { OrderCard } from "./OrderCard";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserOrders } from "../State/Order/Action";

export const Orders = () => {
  const { auth, cart, order } = useSelector((store) => store);
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserOrders(jwt));
  }, [auth.jwt]);

  return (
    <div className="flex items-center flex-col lg:mt-20 pb-10">
      <h1 className="text-xl text-center py-7 font-semibold">Order History</h1>
      <div className="space-y-5 w-full lg:w-1/2">
        {order.orders
          .sort((a, b) => b.id - a.id)
          .map((order) =>
            order.items?.map((item) => <OrderCard order={order} item={item} />)
          )}
      </div>
    </div>
  );
};
