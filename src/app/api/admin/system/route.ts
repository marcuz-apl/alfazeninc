import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  const SESSION_SECRET = process.env.SESSION_SECRET || 'alfazen-secure-secret-token';
  
  if (!session || session.value !== SESSION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Basic OS stats
    const platform = os.platform();
    const release = os.release();
    const arch = os.arch();
    const uptime = os.uptime();
    
    // CPU stats
    const cpus = os.cpus();
    const cpuModel = cpus.length > 0 ? cpus[0].model : 'Unknown';
    const cpuCores = cpus.length;
    const loadAvg = os.loadavg(); // [1, 5, 15] minute averages

    // Memory stats
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsagePercent = totalMem > 0 ? ((usedMem / totalMem) * 100).toFixed(1) : '0';

    // Node env
    const nodeVersion = process.version;

    // GPU check
    let gpuInfo = 'Virtual Environment / No Dedicated GPU Detected';
    try {
      if (platform === 'linux') {
        // Try nvidia-smi first
        try {
          const { stdout } = await execAsync('nvidia-smi --query-gpu=name --format=csv,noheader', { timeout: 1000 });
          if (stdout && stdout.trim().length > 0) {
            gpuInfo = stdout.trim().split('\n').join(', ');
          }
        } catch {
          // If nvidia-smi fails, try lshw or just leave as virtual
          // Since lspci and lshw might not be installed, we gracefully ignore the error
        }
      } else if (platform === 'darwin') {
        // Mac check
        try {
          const { stdout } = await execAsync('system_profiler SPDisplaysDataType | grep "Chipset Model"', { timeout: 1000 });
          if (stdout && stdout.trim().length > 0) {
            gpuInfo = stdout.replace(/Chipset Model:/g, '').trim().split('\n').map(s => s.trim()).join(', ');
          }
        } catch {}
      }
    } catch (e) {
      // Safely ignore GPU detection errors
    }

    const systemInfo = {
      os: {
        platform,
        release,
        arch,
        uptimeSeconds: uptime
      },
      cpu: {
        model: cpuModel,
        cores: cpuCores,
        loadAvg
      },
      memory: {
        totalBytes: totalMem,
        freeBytes: freeMem,
        usedBytes: usedMem,
        usagePercent: parseFloat(memUsagePercent)
      },
      environment: {
        nodeVersion
      },
      gpu: gpuInfo
    };

    return NextResponse.json(systemInfo);
  } catch (error) {
    console.error('Failed to fetch system info:', error);
    return NextResponse.json({ error: 'Failed to fetch system info' }, { status: 500 });
  }
}
