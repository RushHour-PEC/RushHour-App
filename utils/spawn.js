import spawn from './spawn';

const spawnPythonProcess = () => {
    
    const process = spawn("python", [process.env.PYTHON_SCRIPT_PATH, "--flag", "true"]);
  
    process.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });
  
    process.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });
  
    process.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
    });
  };
  
  export default spawnPythonProcess;