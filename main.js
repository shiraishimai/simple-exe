function exe(cmd, callback) {
    console.log("cmd>>", cmd);
    callback = callback || (() => {});
    let spawn = require("child_process").spawn,
        arg = Array.isArray(cmd) ? cmd : cmd.split(" "),
        command = arg.shift(),
        subProcess = spawn(command, arg, {
            stdio: "inherit"
        });
    subProcess.on("exit", code => {});
    subProcess.on("close", code => {
        console.log("\x1b[32;3m Close with code:", code, "\x1b[0m");
        if (code === 0) return callback();
        return callback(code);
    });
    subProcess.on("error", code => {
        console.log("\x1b[31m Error with code:", code, "\x1b[0m");
        return callback(code);
    });
};
module.exports = exe;