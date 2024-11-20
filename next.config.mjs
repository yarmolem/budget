import MillionLint from '@million/lint'

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default MillionLint.next({
  rsc: true,
  enabled: true,
  filter: {
    include: '**/components/*.{mtsx,mjsx,tsx,jsx}'
  }
})(nextConfig)

/* export default nextConfig */
