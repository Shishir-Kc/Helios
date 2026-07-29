import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, X } from "lucide-react";
import Loading from "./Loading";

export default function UnreleasedModel() {
  const navigate = useNavigate();
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPopupVisible(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[60vh]">
      <Loading label="This model has not been released yet" />

      <AnimatePresence>
        {popupVisible && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setPopupVisible(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
            >
              <div className="bg-[#FAF9F6] border border-zinc-200 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
                <h2 className="font-serif text-2xl font-bold text-zinc-950 mb-3">
                  Still waiting?
                </h2>
                <p className="text-sm font-mono text-zinc-500 leading-relaxed mb-8">
                  Is this model released or not, do you even know?
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    className="w-full py-3 bg-black text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg hover:bg-[#F27D26] transition-colors cursor-pointer"
                    onClick={() => navigate("/models")}
                  >
                    Back to Models
                  </button>
                  <button
                    className="w-full py-3 bg-zinc-100 text-zinc-700 text-xs font-mono font-bold uppercase tracking-wider rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer"
                    onClick={() => setPopupVisible(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}