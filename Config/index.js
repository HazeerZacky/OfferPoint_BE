const baseConfig = require('./base.config');
const developmentConfig = require('./development.config');
const productionConfig = require('./production.config');

function resolveEnvConfig(env){
    switch(env){
        case 'development':
            return developmentConfig;
        case 'production':
            return productionConfig;
        default:
            return {};
    }
}

module.exports = Object.assign(baseConfig, resolveEnvConfig(process.env.CONFIG));