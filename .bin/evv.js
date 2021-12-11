#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));

switch (argv._[0]) {
    case 'dev':
        runServer()
        break;
    case 'build':
        console.log('build');
        break;
    default:
        console.log('Illegality command');
        break;
}
function runServer() {
    const { createServer, normalizePath } = require('vite')
    const electronPath = require('electron')
    const { spawnSync, spawn, exec, execSync } = require('child_process')
    const TIMEOUT = 500;

    function debounce(f, ms) {
        let isCoolDown = false
        return function () {
            if (isCoolDown) return
            f.apply(this, arguments)
            isCoolDown = true
            setTimeout(() => isCoolDown = false, ms)
        }
    }

    (async () => {
        const viteDevServer = await createServer({
            mode: process.env.NODE_ENV
        })
        await viteDevServer.listen()

        const protocol = `http${viteDevServer.config.server.https ? 's' : ''}:`
        const host = viteDevServer.config.server.host || 'localhost'
        const port = viteDevServer.config.server.port
        const path = '/'
        process.env.VITE_DEV_SERVER_URL = `${protocol}//${host}:${port}${path}`
        // ['node_modules/typescript/lib/tsc.js', '-w']
        let electronProcess = null
        const runElectron = debounce(() => {
            if (electronProcess !== null) {
                electronProcess.kill('SIGINT')
                electronProcess = null
            }
            electronProcess = spawn(String(electronPath), ['.'])
            electronProcess.stdout.on('data', d => console.log(d.toString()))
            electronProcess.stderr.on('data', d => console.error(d.toString()))
            return electronProcess
        }, TIMEOUT)

        console.log('waiting...')
        let tscProcess = null
        const runTsc = debounce(() => {
            if (tscProcess !== null) {
                tscProcess.kill('SIGINT')
                tscProcess = null
            }
            tscProcess = exec('tsc', {
                cwd: process.cwd()
            }, () => {
                runElectron()
            })
            tscProcess.stdout.on('data', d => console.log(d.toString()))
            tscProcess.stderr.on('data', d => console.error(d.toString()))
            return tscProcess
        }, TIMEOUT);

        runTsc();

        viteDevServer.watcher
            .on('unlink', path => {
                console.log(`file: ${path} removed`);
                const normalizedPath = normalizePath(path)
                if (electronProcess !== null && normalizedPath.match(/packages\/(main|preload)\/.*\.ts$/)) {
                    electronProcess.kill('SIGINT')
                    electronProcess = null
                }
                return runElectron();
            })
            .on('change', (path) => {
                console.log(`file: ${path} changed`);
                const normalizedPath = normalizePath(path);
                if (normalizedPath.match(/packages\/(main|preload)\/.*\.ts$/)) {
                    console.log('waiting...')
                    exec(`tsc ${path}`, {
                        cwd: process.cwd()
                    }, () => {
                        return runElectron();
                    })
                }
            })

    })()
}
