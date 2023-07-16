
/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        customKey: 'he2jl8b9JSBTrxZp9QbCc708v5dJYm8srZcUatykMDtFEvblABo8gBMk',
    },
    images: {
        domains: ['images.pexels.com', 'www.pexels.com', 'api.pexels.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
                port: '',
                pathname: '/photos/**'
            },
            {
                protocol: 'https',
                hostname: 'www.pexels.com',
                port: '',
                pathname: '/photo/**'
            },
            {
                protocol: 'https',
                hostname: 'api.pexels.com',
                port: '',
                pathname: '/**'
            }
        ]
    }
}

module.exports = nextConfig
