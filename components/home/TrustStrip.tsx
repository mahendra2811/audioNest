'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Shield, UserX, Smartphone } from 'lucide-react';

interface Badge {
  icon: React.ReactNode;
  label: string;
}

const badges: Badge[] = [
  {
    icon: <CheckCircle className="w-4 h-4 text-orange-500 shrink-0" />,
    label: '100% Free',
  },
  {
    icon: <Shield className="w-4 h-4 text-orange-500 shrink-0" />,
    label: 'No Upload',
  },
  {
    icon: <UserX className="w-4 h-4 text-orange-500 shrink-0" />,
    label: 'No Sign-up',
  },
  {
    icon: <Smartphone className="w-4 h-4 text-orange-500 shrink-0" />,
    label: 'Works on Mobile',
  },
];

export function TrustStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full flex justify-center px-4"
    >
      <div className="inline-flex flex-wrap justify-center gap-3 rounded-2xl bg-white/8 backdrop-blur-sm border border-white/10 px-5 py-3">
        {badges.map((badge) => (
          <div
            key={badge.label}
            className="flex items-center gap-1.5 text-sm text-white/80"
          >
            {badge.icon}
            <span>{badge.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
