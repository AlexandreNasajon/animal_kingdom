"use client"
import { motion } from "framer-motion"

export const MenuBackgroundAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating leaves */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`leaf-${i}`}
          className="absolute"
          initial={{
            x: Math.random() * 100 + "%",
            y: -20,
            rotate: Math.random() * 360,
          }}
          animate={{
            y: "120vh",
            rotate: Math.random() * 720 - 360,
          }}
          transition={{
            duration: Math.random() * 20 + 15,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 10,
            ease: "linear",
          }}
        >
          <div className="w-6 h-6 text-green-300 opacity-70">
            <LeafSvg />
          </div>
        </motion.div>
      ))}

      {/* Cute animals */}
      <motion.div
        className="absolute bottom-10 left-10"
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <div className="w-24 h-24">
          <FoxAnimation />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-20"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <div className="w-20 h-20">
          <BunnyAnimation />
        </div>
      </motion.div>

      <motion.div
        className="absolute top-40 right-40"
        animate={{
          y: [0, 15, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <div className="w-16 h-16">
          <BirdAnimation />
        </div>
      </motion.div>
    </div>
  )
}

const LeafSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z" />
  </svg>
)

const FoxAnimation = () => (
  <svg viewBox="0 0 24 24" fill="#ff9800">
    <path d="M12,3C8,3 4,7 4,11V22H20V11C20,7 16,3 12,3M12,5C13.27,5 14.45,5.43 15.41,6.17C14.5,6.55 13.5,7 12.5,7.5C10.84,8.5 9.5,10 8.5,11.5C7.23,13.07 6.5,14.32 6.05,15C5.5,14 5,12.5 5,11C5,7.58 8.14,5 12,5M17,11C17,13.21 15.21,15 13,15C10.79,15 9,13.21 9,11C9,8.79 10.79,7 13,7C15.21,7 17,8.79 17,11M15,11C15,9.9 14.1,9 13,9C11.9,9 11,9.9 11,11C11,12.1 11.9,13 13,13C14.1,13 15,12.1 15,11M20,22H4V20H20V22Z" />
  </svg>
)

const BunnyAnimation = () => (
  <svg viewBox="0 0 24 24" fill="#f5f5f5">
    <path d="M20 8H17.19C16.74 7.2 16.12 6.5 15.37 6C15.73 5.19 16 4.32 16 3.5C16 1.43 14.57 0 12.5 0C11.09 0 9.89 0.77 9.34 1.89C8.96 1.79 8.56 1.75 8.15 1.75C6.79 1.75 5.53 2.42 4.83 3.5H4C2.9 3.5 2 4.4 2 5.5V7C2 8.1 2.9 9 4 9H5V10.5C5 13.82 7.23 16.53 10.38 17.31C10.14 18.13 9.69 19 9 19C8.45 19 8 19.45 8 20V22H16V20C16 19.45 15.55 19 15 19C14.31 19 13.86 18.13 13.62 17.31C16.77 16.53 19 13.82 19 10.5V9H20C21.1 9 22 8.1 22 7V5.5C22 4.4 21.1 3.5 20 3.5M4 5.5V7H5V5.5H4M20 7H19V5.5H20V7M15.88 14.97C14.29 16.02 12.37 16.02 10.78 14.97C8.47 13.5 7 11.2 7 8.5V4.17C7.3 4.06 7.63 4 8 4C9.1 4 10 4.9 10 6V10.5C10 10.5 11.54 10.4 12.53 9.4C12.83 9.1 13.27 9.1 13.57 9.4C14.56 10.4 16.1 10.5 16.1 10.5V6C16.1 4.9 17 4 18.1 4C18.47 4 18.8 4.06 19.1 4.17V8.5C19 11.2 17.53 13.5 15.88 14.97Z" />
  </svg>
)

const BirdAnimation = () => (
  <svg viewBox="0 0 24 24" fill="#03a9f4">
    <path d="M23 11.5L19.95 10.37C19.69 9.22 19.04 8.56 19.04 8.56C17.4 6.92 14.75 6.92 13.11 8.56L11.63 10.04L5 3.41L3.41 5L8.97 10.56L7.5 12.03C7.5 12.03 6.81 11.17 5.8 10.66C4.47 10 2.94 10.07 1.64 10.97L4.57 13.91L3.59 14.88L1 13.38L2.5 16.5L5.63 19.63L8.75 21.13L7.25 18.54L8.22 17.56L11.16 20.5C12.06 19.2 12.13 17.67 11.47 16.34C10.96 15.33 10.1 14.64 10.1 14.64L11.57 13.17L17.13 18.73L18.73 17.14L12.1 10.5C12.1 10.5 12.82 9.78 13.97 9.5L13.5 8L16.5 5L15.88 7.05C15.88 7.05 18.53 9.69 18.53 12.61C18.53 13.93 18 15.09 17.14 15.95L19.64 18.46L21 17.53L19.56 16.12C20.87 14.77 21.73 13 21.95 11.5H23Z" />
  </svg>
)
