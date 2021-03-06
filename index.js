const fs = require('fs');
const path = require('path');
const Client = require('fabric-client');
var await = require('await')
const CHANNEL_1_PATH = './ksachdeva-exp-channel-1.tx';
const KEY_STORE_PATH_ADMIN = './keystore/admin';
const ORDERER_URL = 'grpcs://104.196.33.192:7050';
const ORDERER_TLS_CAROOT_PATH = './crypto-config/ordererOrganizations/ksachdeva-exp.com/orderers/orderer.ksachdeva-exp.com/tls/ca.crt';



const CHANNEL_NAME = 'ksachdeva-exp-channel-1'
const CHAIN_CODE_ID = 'ksachdeva-exp-cc'

async function getClient(orgn, adminmsp, mspid) {
    var client = new Client();
    console.log('Setting up the cryptoSuite ..');
    const cryptoSuite = Client.newCryptoSuite();
    cryptoSuite.setCryptoKeyStore(Client.newCryptoKeyStore({
        path: `${KEY_STORE_PATH_ADMIN}-${orgn}`
    }));
    client.setCryptoSuite(cryptoSuite);
    console.log('Setting up the keyvalue store ..');
    // ## Setup the default keyvalue store where the state will be stored
    const store = await Client.newDefaultKeyValueStore({
        path: `${KEY_STORE_PATH_ADMIN}-${orgn}`
    });
    client.setStateStore(store);
    console.log('Setting up the keyvalue store ..');
    const ORG_ADMIN_MSP = adminmsp;
    const privateKeyFile = fs.readdirSync(__dirname + "/" + ORG_ADMIN_MSP + '/keystore')[0];

    const cryptoContentOrgAdmin = {
        privateKey: ORG_ADMIN_MSP + '/keystore/' + privateKeyFile,
        signedCert: ORG_ADMIN_MSP + '/signcerts/Admin@' + orgn + '.ksachdeva-exp.com-cert.pem'
    };

    const result = await client.createUser({
        username: `${orgn}-admin`,
        mspid: mspid,
        cryptoContent: cryptoContentOrgAdmin
    });
    return client
}


async function getOrderer(client) {
    // build an orderer that will be used to connect to it
    const data = await fs.readFileSync(path.join(__dirname, ORDERER_TLS_CAROOT_PATH));
    try {
        var orderer = await client.newOrderer(ORDERER_URL, {
            'pem': Buffer.from(data).toString(),
            'ssl-target-name-override': 'orderer.ksachdeva-exp.com'
        });
    } catch (error) {
        console.log(error);
    }
    return orderer
}

async function mainChannel(orgn,orgnadminmsp,orgnmsp,channelName) {
    const org1Client = await getClient(orgn, orgnadminmsp, orgnmsp);
    const orderer = await getOrderer(org1Client);

    // read in the envelope for the channel config raw bytes
    console.log('Reading the envelope from manually created channel transaction ..');
    const envelope = fs.readFileSync(path.join(__dirname, CHANNEL_1_PATH));

    // extract the configuration
    console.log('Extracting the channel configuration ..');
    const channelConfig = org1Client.extractChannelConfig(envelope);


    console.log('Signing the extracted channel configuration ..');
    const signature1 = org1Client.signChannelConfig(channelConfig);
    // prepare the request
    const channelRequest = {
        name: channelName,
        config: channelConfig,
        signatures: [signature1],
        orderer: orderer,
        txId: org1Client.newTransactionID()
    };

    try {
        console.log('Sending the request to create the channel ..');
        var response = await org1Client.createChannel(channelRequest);

    } catch (error) {
        console.log(error);

    }

    console.log(response);
}


const PEERS = {
    org1: {
        peers: [
            {
                url: 'grpcs://34.73.236.174:7051' // peer0
            },
            {
                url: 'grpcs://34.73.236.174:8051' // peer1
            }
        ]
    },
    org2: {
        peers: [
            {
                url: 'grpcs://34.73.236.174:9051' // peer0
            },
            {
                url: 'grpcs://34.73.236.174:10051' // peer1
            }
        ]
    },
    org3: {
        peers: [
            {
                url: 'grpcs://34.73.236.174:11051' // peer0
            },
            {
                url: 'grpcs://34.73.236.174:12051' // peer1
            }
        ]
    }
};

async function getPeers(client, org) {
    const peers = [];
    for (let i = 0; i < 2; i++) {
        const tls_cacert = `./crypto-config/peerOrganizations/${org}.ksachdeva-exp.com/peers/peer${i}.${org}.ksachdeva-exp.com/tls/ca.crt`;
        const data = fs.readFileSync(path.join(__dirname, tls_cacert));
        const p = client.newPeer(PEERS[org].peers[i].url, {
            'pem': Buffer.from(data).toString(),
            'ssl-target-name-override': `peer${i}.${org}.ksachdeva-exp.com`
        });
        peers[i] = p;
    }
    return peers;
}


module.exports = {
    getClient: getClient,
    getOrderer: getOrderer,
    createChannel: mainChannel,
    getPeers: getPeers,
}





