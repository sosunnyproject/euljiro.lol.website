import path from "path";
import {fileURLToPath} from 'url';
import { merge } from "webpack-merge";
import commonConfiguration from "./webpack.common.mjs";
import {internalIpV6, internalIpV4} from 'internal-ip';
import portFinderSync from "portfinder-sync";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const infoColor = (_message) =>
{
    return `\u001b[1m\u001b[34m${_message}\u001b[39m\u001b[22m`
}

export default merge(
    commonConfiguration,
    {
        stats: 'errors-warnings',
        mode: 'development',
        devServer:
        {
            host: 'local-ip',
            port: portFinderSync.getPort(8080),
            open: true,
            https: false,
            allowedHosts: 'all',
            hot: true,
            watchFiles: ['src/**', 'static/**'],
            static:
            {
                watch: true,
                directory: path.resolve(__dirname, '../static')
            },
            client:
            {
                logging: 'none',
                overlay: true,
                progress: false
            },
            onAfterSetupMiddleware: async function(devServer)
            {
                const port = devServer.options.port
                const https = devServer.options.https ? 's' : ''
                const localIp = await internalIpV4();
                const domain1 = `http${https}://${localIp}:${port}`
                const domain2 = `http${https}://localhost:${port}`
                
                console.log(`Project running at:\n  - ${infoColor(domain1)}\n  - ${infoColor(domain2)}`)
            }
        }
    }
)
