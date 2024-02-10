const {merge} = require('webpack-merge');
import baseConfig from './base.config';
import devConfig from './dev.config';
import productionConfig from './production.config';

function getEnvConfig(env){
    switch (env) {
        case 'development':
            return devConfig;
        case 'production':
            return productionConfig;
    }
}

export default merge(baseConfig, getEnvConfig(process.env.CONFIG));  