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

async function instantiateChaincodeOnPeers(orgn, adminmsp, mspid) {

    const client = await myClient.getClient(orgn, adminmsp, mspid);
    const orderer = await myClient.getOrderer(client);

    console.log('Creating a Channel object ..');
    const channel = client.newChannel(CHANNEL_NAME);

    console.log('Specifying the orderer to connect to ..');
    channel.addOrderer(orderer);

    console.log('Getting the peers ..');
    const peers = await myClient.getPeers(client, orgn);

    peers.map(p => channel.addPeer(p));

    console.log('Initializing the channel ..');
    await channel.initialize();

    console.log('Sending the Instantiate Proposal ..');
    const proposalResponse = await channel.sendInstantiateProposal({
        chaincodeId: CHAIN_CODE_ID,
        chaincodeVersion: 'v3',
        fcn: 'init',
        args: ["a", "100", "b", "200"],
        txId: client.newTransactionID(),
        chaincodeType:'golang'
    });

    

    console.log('Sending the Transaction ..');
    const transactionResponse = await channel.sendTransaction({
        proposalResponses: proposalResponse[0],
        proposal: proposalResponse[1]
    });
    console.log(transactionResponse);
    
}

async function main() {
    await instantiateChaincodeOnPeers(org1,ORG1_ADMIN_MSP,ORG1_MSP_ID);
}

main();