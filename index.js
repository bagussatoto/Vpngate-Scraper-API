const fs = require('fs');
const getVpnList = require("./lib/main");

const saveBase64ToFile = (base64Data, filename) => {
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filename, buffer);
};

const generateReadme = (vpnList) => {
    let content = `# VPN List\n\n`;
    content += `This is an auto-generated list of VPNs retrieved from a specific source.\n\n`;
    
    content += `## Last Updated\n\n`;
    content += `This list was last updated on: ${getDate(Date.now())}.\n\n`;
    
    content += `## Available Servers\n\n`;
    content += `Below is the list of available VPN servers:\n\n`;

    content += "| Hostname | IP Address | Score | Country | OpenVPN Config |\n";
    content += "|----------|------------|-------|---------|----------------|\n";
    vpnList.servers.forEach((server, index) => {
        content += `| ${server.hostname} | ${server.ip} | ${server.score} | ${server.countrylong} | [Download 📥](./configs/server${index}.ovpn) |\n`;
    });

    content += `\n\n### Note: Please respect the terms of use for each VPN.\n\n`;

    content += `---\n\n`;
    content += `Generated by [fdciabdul](#) | [imtaqin.id](imtaqin.id)\n\n`;

    fs.writeFileSync('README.md', content);
}


const getDate = (unix) => {
    return `${new Date(unix).toUTCString()}`;
}

// Make sure the configs directory exists
if (!fs.existsSync('./configs')) {
    fs.mkdirSync('./configs');
}

getVpnList()
    .then(vpnList => {
        servers = vpnList.servers;
        countries = vpnList.countries;
        lastUpdated = Date.now();
        fs.writeFileSync("json/data.json",JSON.stringify(vpnList),"utf-8")
        // Save the configs and update the readme
        vpnList.servers.forEach((server, index) => {
            const configData = server.openvpn_configdata_base64;
            saveBase64ToFile(configData, `./configs/server${index}.ovpn`);
        });

        generateReadme(vpnList);
    })
    .catch(err => {
        console.log(err);
    });
