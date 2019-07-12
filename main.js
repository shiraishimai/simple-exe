class ExitMessage {
    constructor(str) {
        this.message = str;
    }
}
const EXIT = (exporting) => {
    return new ExitMessage(exporting);
};
function exe(cmd, inspect) {
    if (!cmd) return;
    console.log("cmd>>", cmd);
    return new Promise((resolve, reject) => {
        const spawn = require("child_process").spawn,
            arg = Array.isArray(cmd) ? cmd : cmd.split(" "),
            command = arg.shift(),
            subProcess = spawn(command, arg, {
                stdio: [0,'pipe','pipe']    // inherit stdin of parent
            });
        let output = "",
            message;

        subProcess.on("exit", code => console.log("[SubProcess exit]", code));
        subProcess.on("close", code => {
            console.log("\x1b[32;3m[SubProcess close]", code, "\x1b[0m");
            // Don't reject when message is found
            if (code === 0 || message) return resolve({
                code,
                output,
                message
            });
            return reject({
                code,
                output,
                message
            });
        });
        subProcess.on("error", code => {
            console.log("\x1b[31m[SubProcess error]", code, "\x1b[0m");
            return reject({
                code,
                output,
                message
            });
        });
    
        
        subProcess.stdout && subProcess.stdout.setEncoding('utf8');
        subProcess.stdout && subProcess.stdout.on("data", outData => {
            output += outData;
        });
        
        // Inspect progressing output, allowing interrupt of process
        // @TODO pipe stderr back to parent?
        subProcess.stderr && subProcess.stderr.setEncoding('utf8');
        subProcess.stderr && subProcess.stderr.on("data", progressOutput => {
            try {
                if (Object.prototype.toString.call(inspect) !== "[object Function]") return console.log(progressOutput);
                let exiting = inspect(progressOutput);
                if (exiting instanceof ExitMessage || exiting === EXIT) {
                    message = exiting.message || "execution interrupted";
                    subProcess.kill();
                }
            } catch(e) {}
        });
    });
};
exe.EXIT = EXIT;
module.exports = exe;