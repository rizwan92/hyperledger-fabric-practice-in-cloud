const Client = require('fabric-client');
const myClient = require('./index.js');
var await = require('await')
const fs = require('fs');
const path = require('path');

const org1 = 'org1';
const org2 = 'org2';
const org3 = 'org3';

const ORG1_ADMIN_MSP = './crypto-config/peerOrganizations/org1.ksachdeva-exp.com/users/Admin@org1.ksachdeva-exp.com/msp';
const ORG2_ADMIN_MSP = './crypto-config/peerOrganizations/org2.ksachdeva-exp.com/users/Admin@org2.ksachdeva-exp.com/msp';
const ORG3_ADMIN_MSP = './crypto-config/peerOrganizations/org3.ksachdeva-exp.com/users/Admin@org3.ksachdeva-exp.com/msp';

const ORG1_MSP_ID = 'Org1MSP'
const ORG2_MSP_ID = 'Org2MSP'
const ORG3_MSP_ID = 'Org3MSP'

const CHANNEL_NAME = 'ksachdeva-exp-channel-1'
const CHAIN_CODE_ID = 'ksachdeva-exp-cc'

async function installChaincodeOnPeers(orgn, adminmsp, mspid) {

    const client = await myClient.getClient(orgn, adminmsp, mspid);
    const orderer = await myClient.getOrderer(client);

    console.log('Creating a Channel object ..');
    const channel = client.newChannel(CHANNEL_NAME);

    console.log('Specifying the orderer to connect to ..');
    channel.addOrderer(orderer);

    console.log('Getting the peers ..');
    const peers = await myClient.getPeers(client, org1);


    // Note-
    // The installChaincode is going to pick the chaincodePath
    // from the local GOPATH
    //
    // Below I am just tricking it by setting the GOPATH environment
    // variable and pointing it to the directory that contains the
    // actual chain code
    process.env.GOPATH = path.join(__dirname, './chaincode');
    try {
        var proposalResponse = await client.installChaincode({
            targets: peers,
            chaincodeId: CHAIN_CODE_ID,
            chaincodePath: 'github.com/example_cc.go',
            chaincodeVersion: 'v2'
        });

    } catch (err) {
        console.log(err.stack ? err.stack : err);

    }

    console.log(proposalResponse[0]);

}

async function letsqueryInstalledChaincodes(orgn, adminmsp, mspid) {

    const client = await myClient.getClient(orgn, adminmsp, mspid);
    const peers = await myClient.getPeers(client, orgn);
    const result = await client.queryInstalledChaincodes(peers[0],true)
    console.log(result);
    
    }

// installChaincodeOnPeers(org1, ORG1_ADMIN_MSP, ORG1_MSP_ID)
letsqueryInstalledChaincodes(org1, ORG1_ADMIN_MSP, ORG1_MSP_ID)