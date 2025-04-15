import React, { useEffect } from "react";
import { OrderCard } from "./OrderCard";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserOrders } from "../State/Order/Action";
import CenterLoader from "../Templates/CenterLoader";
import NoDataFound from "../Templates/NoDataFound";

export const Orders = () => {
  const { auth, order } = useSelector((store) => store);
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserOrders(jwt));
  }, [auth.jwt]);

  //  Loading State
  if (order.loading) {
    return <CenterLoader message="Loading order history..." />;
  }

  // No Data Found State
  if (!order.orders || order.orders.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <NoDataFound
          title="No Orders Yet"
          description="You haven't placed any orders so far."
          icon="file"
          actionLabel="Go to Home"
          onAction={() => navigate("/")}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center flex-col lg:mt-20 pb-10">
      <h1 className="text-xl text-center py-7 font-semibold">Order History</h1>
      <div className="space-y-5 w-full lg:w-1/2">
        {order?.orders
          .sort((a, b) => b.id - a.id)
          .map((order) =>
            order.items?.map((item) => <OrderCard order={order} item={item} />)
          )}
      </div>
    </div>
  );
};
