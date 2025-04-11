import axios from "axios";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EsewaCallback = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const hasVerified = useRef(false);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/payment/esewa/verify",
          {
            transaction_uuid: "ORD-" + orderId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          }
        );

        console.log("Verification success:", response.data);
        navigate(`/payment/success/${orderId}`);
      } catch (error) {
        console.error("eSewa payment verification failed:", error);
        navigate("/payment/fail");
      }
    };

    if (!hasVerified.current) {
      hasVerified.current = true;
      verifyPayment();
    }
  }, [navigate, orderId]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg font-semibold">Verifying eSewa payment...</p>
    </div>
  );
};

export default EsewaCallback;
