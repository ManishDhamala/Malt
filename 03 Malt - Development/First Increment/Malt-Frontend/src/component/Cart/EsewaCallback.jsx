import axios from "axios";
import { useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import CenterLoader from "../Templates/CenterLoader";

const EsewaCallback = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const hasVerified = useRef(false);

  const decodeEsewaData = () => {
    const base64Data = searchParams.get("data");
    if (!base64Data) return null;

    try {
      const decodedJson = atob(base64Data); // decode base64 string
      return JSON.parse(decodedJson); // Convert to JSON
    } catch (error) {
      console.error("Failed to decode eSewa data:", error);
      return null;
    }
  };

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const esewaData = decodeEsewaData();

        if (!esewaData || !esewaData.signature || !esewaData.status) {
          throw new Error("Missing required payment data from eSewa");
        }

        const refId = esewaData.transaction_uuid;
        const signature = esewaData.signature;
        const status = esewaData.status;

        console.log("Sending eSewa payment verification for refId:", refId);

        const response = await axios.post(
          "http://localhost:8080/api/payment/esewa/verify",
          {
            orderId: orderId,
            signature: signature,
            status: status,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Verification success:", response.data);

        // Redirect to order confirmation after short delay
        setTimeout(() => {
          navigate(`/payment/success/${orderId}`);
        }, 1000);
      } catch (error) {
        console.error("eSewa payment verification failed:", error);

        // Redirect to failure page after short delay
        setTimeout(() => {
          navigate("/payment/fail");
        }, 1000);
      }
    };

    if (!hasVerified.current && orderId) {
      hasVerified.current = true;
      verifyPayment();
    }
  }, [navigate, orderId, searchParams]);

  return <CenterLoader message="Verifying your eSewa payment..." />;
};

export default EsewaCallback;
