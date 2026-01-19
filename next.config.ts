import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'styles')],
    additionalData: (content: string, loaderContext: { resourcePath: string }) => {
      const tokensPath = path.join('styles', '_tokens.scss')

      if (loaderContext.resourcePath.endsWith(tokensPath)) {
        return content
      }

      return `@use "tokens" as *;\n${content}`
    },
  },
}

export default nextConfig
