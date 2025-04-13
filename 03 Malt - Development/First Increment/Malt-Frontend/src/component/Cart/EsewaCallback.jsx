import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const EsewaCallback = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const hasVerified = useRef(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);

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

        const refId = esewaData.transaction_uuid; //ORD-order_id
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
        setVerifying(false);

        // Redirect to order confirmation after short delay
        setTimeout(() => {
          navigate(`/payment/success/${orderId}`);
        }, 1500);
      } catch (error) {
        console.error("eSewa payment verification failed:", error);
        setError(error.message || "Payment verification failed");
        setVerifying(false);

        // Redirect to failure page after short delay
        setTimeout(() => {
          navigate("/payment/fail");
        }, 1500);
      }
    };

    if (!hasVerified.current && orderId) {
      hasVerified.current = true;
      verifyPayment();
    }
  }, [navigate, orderId, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      {verifying ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">
            Verifying your eSewa payment...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Please wait while we confirm your transaction.
          </p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">
          <p className="text-lg font-semibold">Payment Verification Failed</p>
          <p className="text-sm mt-2">{error}</p>
          <p className="text-sm mt-4">Redirecting to payment failure page...</p>
        </div>
      ) : (
        <div className="text-center text-green-500">
          <p className="text-lg font-semibold">
            Payment Verified Successfully!
          </p>
          <p className="text-sm mt-2">
            Redirecting to order confirmation page...
          </p>
        </div>
      )}
    </div>
  );
};

export default EsewaCallback;
