  const cron = require('node-cron');
  const { AstriIntegrator } = require('./main');
  const { readFileSync } = require('fs');
  const path = require('path');
  
  // Read target IPs from configuration
  const getTargetIPs = () => {
    try {
      const configPath = path.join(__dirname, 'config', 'targets.json');
      const targets = JSON.parse(readFileSync(configPath, 'utf8'));
      return targets.ips || [];
    } catch (error) {
      console.error('Error reading targets:', error);
      return [];
    }
  }
  
  // Process all devices
  async function processAllDevices() {
    const astri = new AstriIntegrator();
    const targets = getTargetIPs();
    
    console.log(`Starting daily scan at ${new Date().toISOString()}`);
    
    for (const ip of targets) {
      try {
        await astri.processDevice(ip);
        console.log(`Processed ${ip} successfully`);
      } catch (error) {
        console.error(`Error processing ${ip}:`, error);
      }
      // Add delay between devices to prevent overwhelming
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    console.log(`Completed daily scan at ${new Date().toISOString()}`);
  }
  
  // Schedule task to run at 00:00 (midnight) every day
  cron.schedule('0 0 * * *', async () => {
    try {
      await processAllDevices();
    } catch (error) {
      console.error('Cron job failed:', error);
    }
  }, {
    timezone: "Asia/Jakarta"  // Set sesuai timezone Anda
  });
  
  console.log('Cron job scheduled');
  
