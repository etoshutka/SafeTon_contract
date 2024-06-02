import { Address, Cell, Dictionary, DictionaryValue, beginCell, contractAddress, fromNano, toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { SafeTON } from '../wrappers/SafeTON';

const CONTRACT_ADDRESS: string = 'EQB5DoB1IDdy1fwhvDyoEmr0zV-ULuunw5zlk6y2OeUU7bYQ';

export async function run(provider: NetworkProvider) {
    const index: number = 1;
    const nft_content = beginCell().storeStringTail(`item_${index}.json`).endCell();

    const cell = beginCell().storeAddress(provider.sender().address).storeRef(nft_content).endCell();

    const msg_body = beginCell()
        .storeUint(1, 32)
        .storeUint(5, 64)
        .storeUint(index, 64) // item index
        .storeCoins(toNano(0.03)) // forward amount
        .storeRef(cell)
        .endCell();
    const tons_to_mint = toNano('0.03');

    const nft_collection_contract = provider.open(SafeTON.createFromAddress(Address.parse(CONTRACT_ADDRESS)));

    await nft_collection_contract.sendMintRequest(provider.sender(), tons_to_mint, index, 0.03, nft_content);
}