import axios from "axios";
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const KhaltiCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const pidx = params.get("pidx");

  // Ref to track whether the effect has run (Preventing email from being sent twice)
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

        if (data.success) {
          navigate(`/payment/success/${data.orderId}`);
        } else {
          navigate("/payment/fail");
        }
      } catch (err) {
        console.error("Verification failed", err);
        navigate("/payment/fail");
      }
    };

    if (pidx && !hasVerified.current) {
      hasVerified.current = true;
      verifyPayment();
    }
  }, [pidx, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg font-semibold">Verifying Khalti payment...</p>
    </div>
  );
};

export default KhaltiCallback;
