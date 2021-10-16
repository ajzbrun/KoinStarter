const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath); //delete folder build and everything inside

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');
const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath); //check if the dir exists, if not, it create the dir

//recreates the contracts inside of Campaign.sol that the solidity compiled returned, in the build folder
for(let contract in output){
    fs.outputJsonSync(
        path.resolve(buildPath, contract.toString().replace(':', '') + '.json'),
        output[contract]
    );
}