module.exports = {
    apps: [
        {
            name: 'frog-vs-predator',
            script: 'npx',
            args: 'serve -l 3000 .',
            env: {
                NODE_ENV: 'development',
                PORT: 3000
            },
            watch: false,
            instances: 1,
            exec_mode: 'fork'
        }
    ]
}
