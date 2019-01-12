const Client = require('fabric-client');
const myClient = require('./index.js');
var await = require('await')
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


async function joinOrgPeersToChannel() {
    const client = await myClient.getClient(org1, ORG1_ADMIN_MSP, ORG1_MSP_ID);
    const orderer = await myClient.getOrderer(client);
    console.log(orderer);
    
    console.log('Creating a Channel object ..');
    const channel = client.newChannel(CHANNEL_NAME);

    console.log('Specifying the orderer to connect to ..');
    channel.addOrderer(orderer);


    console.log('Getting the genesis block for the ${CHANNEL_NAME} ..');
    const genesis_block = await channel.getGenesisBlock({
        txId: client.newTransactionID()
    });

    console.log('Getting the peers ..');
    const peers = await myClient.getPeers(client, org1);

    
    // const proposalResponse = await channel.joinChannel({
    //     txId: client.newTransactionID(),
    //     block: genesis_block,
    //     targets: peers
    // });

    // console.log(proposalResponse);
}

joinOrgPeersToChannel()