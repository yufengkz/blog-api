import dev_env from './development'
import test_env from './test'
import prod_env from './production'

export default {
    development: dev_env,
    test: test_env,
    production: prod_env
}[process.env.NODE_ENV || 'development']