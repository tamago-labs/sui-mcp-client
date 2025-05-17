import { exec } from 'child_process';
import { promisify } from 'util';
// import * as fs from 'fs';
// import * as path from 'path';
// import * as os from 'os';

const execAsync = promisify(exec);

export interface CliResult {
  stdout: string;
  stderr: string;
  success: boolean;
  parsed?: any;
}

/**
 * Executes a Sui CLI command
 * @param command The main Sui command (client, move, etc.)
 * @param args Array of arguments to pass to the command
 * @returns Result of the command execution
 */
export const executeSuiCommand = async (
  command: string,
  args: string[]
): Promise<CliResult> => {
  try {
    // Sanitize inputs to prevent command injection
    const sanitizedArgs = args.map(arg => {
      // Basic sanitization - more robust in production
      return arg.replace(/[;&|`$]/g, '');
    });
    
    const fullCommand = `sui ${command} ${sanitizedArgs.join(' ')}`; 
    
    const { stdout, stderr } = await execAsync(fullCommand);
    
    // Try to parse JSON if applicable
    let parsed = undefined;
    if (stdout.trim().startsWith('{') || stdout.trim().startsWith('[')) {
      try {
        parsed = JSON.parse(stdout);
      } catch (e) {
        // Not valid JSON, ignore
      }
    }
    
    return {
      stdout,
      stderr,
      success: true,
      parsed
    };
  } catch (error: any) {
    console.error('Error executing Sui command:', error);
    return {
      stdout: '',
      stderr: error.message || 'Unknown error executing CLI command',
      success: false
    };
  }
};

/**
 * Creates and executes a shell script for more complex commands
 * @param scriptContent Content of the shell script
 * @returns Result of the script execution
 */
// export const executeViaScript = async (scriptContent: string): Promise<CliResult> => {
//   try {
//     // Create temporary script file
//     const tempDir = os.tmpdir();
//     const scriptPath = path.join(tempDir, `sui-butler-${Date.now()}.sh`);
    
//     // Write script to file
//     await fs.promises.writeFile(scriptPath, scriptContent, { mode: 0o755 });
    
//     // Execute the script
//     const { stdout, stderr } = await execAsync(scriptPath);
    
//     // Clean up
//     await fs.promises.unlink(scriptPath);
    
//     return {
//       stdout,
//       stderr,
//       success: true
//     };
//   } catch (error: any) {
//     console.error('Error executing script:', error);
//     return {
//       stdout: '',
//       stderr: error.message || 'Unknown error executing script',
//       success: false
//     };
//   }
// };