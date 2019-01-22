
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

async function queryChaincode(orgn, adminmsp, mspid) {
    const client = await getClient(orgn, adminmsp, mspid);
    const channel = await getChannel(client, orgn);
  
    console.log(`Quering the Chaincode on the peers of  ${org} ..`);
    const response = await channel.queryByChaincode({
      chaincodeId: config.CHAIN_CODE_ID,
      fcn: 'query',
      args: ["a"],
      txId: client.newTransactionID()
    });
  
    console.log(`Peer0 of ${org} has ${response[0].toString('utf8')} as the current value for 'a'..`);
    console.log(`Peer1 of ${org} has ${response[1].toString('utf8')} as the current value for 'a'..`);
  }
  
  async function main() {
    console.log('############  ORG1 ###################');
    await queryChaincode(Organization.ORG1);
    console.log('############  ORG2 ###################');
    await queryChaincode(Organization.ORG2);
    console.log('############  ORG3 ###################');
    await queryChaincode(Organization.ORG3);
  }
  
  main();