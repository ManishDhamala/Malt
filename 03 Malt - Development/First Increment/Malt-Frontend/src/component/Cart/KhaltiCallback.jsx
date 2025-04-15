import axios from "axios";
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CenterLoader from "../Templates/CenterLoader";

const KhaltiCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const pidx = params.get("pidx");
  const status = params.get("status");

  const hasVerified = useRef(false);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const { data } = await axios.post(
          "http://localhost:8080/api/payment/khalti/verify",
          { pidx },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          }
        );

        console.log("Khalti verification response:", data);

        if (data.success) {
          setTimeout(() => navigate(`/payment/success/${data.orderId}`), 1000);
        } else {
          console.warn("Payment was not successful:", data.message);
          setTimeout(() => navigate("/payment/fail"), 1000);
        }
      } catch (err) {
        console.error("Verification failed:", err);
        setTimeout(() => navigate("/payment/fail"), 1000);
      }
    };

    if (!hasVerified.current) {
      hasVerified.current = true;

      if (status === "Completed") {
        verifyPayment();
      } else {
        console.warn(`Khalti payment not completed. Status: ${status}`);
        setTimeout(() => navigate("/payment/fail"), 1000);
      }
    }
  }, [pidx, status, navigate]);

  return <CenterLoader message="Verifying Khalti payment..." />;
};

export default KhaltiCallback;
