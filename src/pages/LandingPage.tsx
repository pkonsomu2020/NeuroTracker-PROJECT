import Button from "../components/ui/Button"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-white min-h-screen text-gray-800">
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-8 md:px-20 py-16 bg-gradient-to-br from-blue-100 to-purple-200">
        <div className="max-w-xl">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold leading-tight mb-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Boost Your Focus & Track Your Mood Seamlessly
          </motion.h1>
          <p className="text-lg mb-6">
            NeuroTracker helps you build healthy routines, track emotional wellbeing, and stay productive with powerful tools like Focus Timer, Mood Journal, and Daily Planner.
          </p>
          <Button onClick={() => navigate("/auth")} className="text-lg px-6 py-3">
            Get Started
          </Button>
        </div>
        <motion.img
          src="/illustration-hero.png"
          alt="App Illustration"
          className="w-full md:w-1/2 mb-10 md:mb-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        />
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-20 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-10">
          <motion.div
            className="bg-gray-100 p-6 rounded-xl shadow-md text-center"
            whileHover={{ scale: 1.05 }}
          >
            <img src="/focus-timer.png" alt="Focus Timer" className="mx-auto mb-4 w-32 h-32 object-contain" />
            <h3 className="text-xl font-semibold mb-2">Focus Timer</h3>
            <p>Use Pomodoro-style timers to stay focused and productive during your tasks.</p>
          </motion.div>

          <motion.div
            className="bg-gray-100 p-6 rounded-xl shadow-md text-center"
            whileHover={{ scale: 1.05 }}
          >
            <img src="/mood-tracker.png" alt="Mood Tracker" className="mx-auto mb-4 w-32 h-32 object-contain" />
            <h3 className="text-xl font-semibold mb-2">Mood Tracker</h3>
            <p>Log your emotions and gain insights into your mental wellbeing over time.</p>
          </motion.div>

          <motion.div
            className="bg-gray-100 p-6 rounded-xl shadow-md text-center"
            whileHover={{ scale: 1.05 }}
          >
            <img src="/planner.png" alt="Daily Planner" className="mx-auto mb-4 w-32 h-32 object-contain" />
            <h3 className="text-xl font-semibold mb-2">Daily Planner</h3>
            <p>Organize your day with routines, tasks, and flexible scheduling tools.</p>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-20 bg-gradient-to-r from-purple-100 to-blue-100">
        <h2 className="text-3xl font-bold mb-6">Ready to Take Control?</h2>
        <p className="mb-8 text-lg">Start using NeuroTracker today for a more focused and balanced life.</p>
        <Button onClick={() => navigate("/auth")} className="text-lg px-6 py-3">
          Get Started
        </Button>
      </section>
    </div>
  )
}

export default LandingPage