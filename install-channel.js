
const myClient = require('./index.js');

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


myClient.createChannel(org1,ORG1_ADMIN_MSP,ORG1_MSP_ID,CHANNEL_NAME);