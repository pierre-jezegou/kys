/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/checkout/form',
                permanent: true,
            },
        ];
    }
};

export default nextConfig;
