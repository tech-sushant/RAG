import { spawn } from 'child_process';
const pythonProcess = spawn('/usr/bin/python3', ['../pdf_to_markdown.py']);

pythonProcess.stdout.on('data', (data) => {
  console.log("Successfully Completed");
});

pythonProcess.stderr.on('data', (data) => {
  console.error(`Error: ${data}`);
});

pythonProcess.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
});
