const {spawn} = require('child_process')
const electron = require('electron')
const fs = require("fs");
const {createServer} = require("vite");

function closeElectronProcess() {
    let pid = fs.existsSync("./pid") ? fs.readFileSync("./pid") : null;
    if (pid !== null) {
        try {
            process.kill(+pid)
        } catch (e) {
            console.log(e)
        }
    }
}

(async () => {
    const viteDevServer = await createServer({
        mode: process.env.NODE_ENV
    })
    await viteDevServer.listen()
    closeElectronProcess();
    process.on("beforeExit", () => closeElectronProcess())
    const protocol = `http${viteDevServer.config.server.https ? 's' : ''}:`
    const host = viteDevServer.config.server.host || 'localhost'
    const port = viteDevServer.config.server.port
    const path = '/'
    process.env.VITE_DEV_SERVER_URL = `${protocol}//${host}:${port}${path}`;

    const electronProcess = spawn(String(electron), ['.'])
    electronProcess.stdout.on('data', d => console.log(d.toString()))
    electronProcess.stderr.on('data', d => console.error(d.toString()));
    fs.writeFileSync("./pid", String(electronProcess.pid));
})()
