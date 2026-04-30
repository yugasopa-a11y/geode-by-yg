"use client"
import React, { useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion"
import { cn } from "@/utils/cn"

export interface FloatingDockProps {
  items: { title: string; icon: React.ReactNode; onClick: () => void }[]
  className?: string
}

const FloatingDock = ({ items, className }: FloatingDockProps) => {
  const mouseX = useMotionValue(Infinity)

  return (
    <div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "backdrop-blur-[20px] bg-black/75 border border-[#c9a96e]/20 rounded-2xl px-3 py-2.5 flex gap-1 inline-flex",
        className
      )}
    >
      {items.map((item) => (
        <DockItem key={item.title} mouseX={mouseX} {...item} />
      ))}
    </div>
  )
}

function DockItem({ mouseX, title, icon, onClick }: {
  mouseX: any;
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const widthTransform = useTransform(distance, [-150, 0, 150], [44, 64, 44])
  const heightTransform = useTransform(distance, [-150, 0, 150], [44, 64, 44])

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 2, x: "-50%" }}
            className="absolute -top-10 left-1/2 px-2 py-1 rounded-lg bg-surface-2 border border-border-color text-xs text-text-primary whitespace-nowrap"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        ref={ref}
        style={{ width, height }}
        className="flex items-center justify-center rounded-xl cursor-pointer hover:bg-[#c9a96e]/10 transition-colors group"
      >
        <div className="text-text-secondary group-hover:text-text-primary transition-colors">
          {icon}
        </div>
      </motion.div>
    </div>
  )
}

export default FloatingDock
