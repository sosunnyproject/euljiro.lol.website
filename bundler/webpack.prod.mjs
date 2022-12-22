import { CleanWebpackPlugin } from "clean-webpack-plugin";
import commonConfiguration from "./webpack.common.mjs";
import { merge } from "webpack-merge";

export default merge(
    commonConfiguration,
    {
        mode: 'production',
        plugins:
        [
            new CleanWebpackPlugin()
        ]
    }
)
