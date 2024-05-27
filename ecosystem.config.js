module.exports = {
    apps: [
        {
            name: 'dream',
            script: 'npm',
            args: 'start',
            env: {
                NODE_ENV: 'production',
                PORT: 4000
            }
        }
    ]
};
