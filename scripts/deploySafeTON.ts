import { Address, toNano } from '@ton/core';
import { SafeTON } from '../wrappers/SafeTON';
import { compile, NetworkProvider } from '@ton/blueprint';

const SafeTON_VALIDATOR = 
    'https://raw.githubusercontent.com/etoshutka/metadates/main/collection_metadata.json'
const SafeTON_VALIDATOR_BASE = 
    'https://raw.githubusercontent.com/etoshutka/metadates/main'

const OWNER_ADDRESS = Address.parse('UQDlyGIved5xvnBXLxTeUs0ZN2q-2UafjwYVr9dHz5ElURpi');

export async function run(provider: NetworkProvider) {
    const collection_content = {
        uri: SafeTON_VALIDATOR,
        base: SafeTON_VALIDATOR_BASE
    };

    const royalty_params = {
        numerator: 20,
        denominator: 100,
        destination_address: OWNER_ADDRESS,
    };

    const config = {
        owner_address: OWNER_ADDRESS,
        next_item_index: 0,
        collection_content: collection_content,
        nft_item_code: await compile('SafeTON'),
        royalty_params: royalty_params,
    };

    const safeTON = provider.open(
        SafeTON.createFromConfig(config, await compile('SafeTON'))
    );

    await safeTON.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(safeTON.address);


    // run methods on `safeTON`
}