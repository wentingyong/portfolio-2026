import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/_dev/tokens',
        destination: '/dev/tokens',
      },
    ]
  },
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'styles')],
    additionalData: (content: string, loaderContext: { resourcePath: string }) => {
      const tokenFiles = [
        path.join('styles', 'tokens.scss'),
        path.join('styles', 'mixins.scss'),
        path.join('styles', 'typography.scss'),
        path.join('styles', 'breakpoints.scss'),
      ]

      if (tokenFiles.some((tokenFile) => loaderContext.resourcePath.endsWith(tokenFile))) {
        return content
      }

      return `@use "tokens" as *;\n${content}`
    },
  },
}

export default nextConfig
