const execute  = require('../utils/execute');
const { blue, red, green } = require('../utils/colors');
const { existsSync, mkdirSync } = require('fs');
const { join } = require('path');

const devDir = join(process.cwd(), 'dev');
const repos = {
	'admin': 'https://github.com/greenpress/admin-panel',
	'assets': 'https://github.com/greenpress/assets-service',
	'auth': 'https://github.com/greenpress/authentication-service',
	'content': 'https://github.com/greenpress/content-service',
	'drafts': 'https://github.com/greenpress/drafts-service',
	'front': 'https://github.com/greenpress/blog-front',
	'secrets': 'https://github.com/greenpress/secrets-service'
};

const images = {
	'admin': 'greenpress_greenpress_1',
	'assets': 'greenpress_greenpress_1',
	'auth': 'greenpress_greenpress_1',
	'content': 'greenpress_greenpress_1',
	'drafts': 'greenpress_greenpress_1',
	'front': 'greenpress_greenpress_1',
	'secrets': 'greenpress_greenpress_1'
};

const scaledImages = {
	'admin': 'greenpress_admin_1',
	'assets': 'greenpress_assets_1',
	'auth': 'greenpress_auth_1',
	'content': 'greenpress_content_1',
	'drafts': 'greenpress_drafts_1',
	'front': 'greenpress_front_1',
	'secrets': 'greenpress_secrets_1'
};

function createDevDir() {
	if (!existsSync(devDir)) {
		mkdirSync(devDir);
	}
}

async function createServices(services, branchName = undefined) {
	let errN = 0;
	for (let service of services) {
		let cloneCommand = `git clone ${branchName !== undefined ? `-b ${branchName}` : ''} ${repos[service]}`;
		console.log(blue(`Cloning ${service}`));
		if (!(await execute(cloneCommand, `create ${service} service`, { cwd: devDir }))) {
			console.log(red(`Failed to clone ${service}`));
			errN += 1;
			continue;
		}
		
		console.log(blue(`Installing ${service}, might take some time`));
		if (!(await execute('npm install', `install local ${service}`, 
			{ cwd: join(devDir, repos[service].substring(repos[service].lastIndexOf('/') + 1)) }))) {
			console.log(red(`Failed to install ${service}`));
			errN += 1;
			continue;
		}

		console.log(green(`Successfully created local ${service}`));
	}

	return errN;
}

function getServicesList() {
	return Object.keys(repos).join(', ');
}

function getContainersByScale(scaled = false) {
	return scaled ? scaledImages : images;
}

module.exports = {
	createServices,
	createDevDir,
	getServicesList,
	getContainersByScale
}