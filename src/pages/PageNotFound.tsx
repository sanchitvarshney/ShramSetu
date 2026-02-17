
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
const PageNotFound = () => {
  return (
     <div className="min-h-screen  flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#000]/20 to-[#000]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80  rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96  rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-6"
        >
          <h1 className="text-9xl md:text-[8rem] font-black bg-gradient-to-r from-[#000] via-[#000] to-[#000] bg-clip-text text-transparent tracking-tight drop-shadow-lg">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          className="relative mb-5"
        >
          <div className="inline-block bg-gray-700 text-white px-5 py-2 rounded-full shadow-lg transform ">
            <span className="text-sm font-semibold tracking-wide">
              Page Not Found
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Oops! We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.
          </h2>
          <p className="text-[17px] text-gray-600 leading-relaxed max-w-md mx-auto">
            The page you're looking for seems to have wandered off into the
            digital void. Don't worry, let's get you back on track!
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/"
            className="group relative inline-flex items-center justify-center px-6 py-2 text-[18px] font-semibold text-white bg-gray-900 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-blue-700 hover:to-indigo-700"
          >
            <span className="relative z-10">Go Home</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="group relative inline-flex items-center justify-center px-6 py-2 text-[18px] font-semibold text-[#fff] bg-gray-600 border-2 border-gray-200 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:border-gray-300"
          >
            <span className="relative z-10">Go Back</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-16 flex justify-center space-x-2"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
              className="w-3 h-3 bg-gradient-to-b from-zinc-700 to-gray-800 rounded-full"
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default PageNotFound