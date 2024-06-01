import { Address, Cell, Dictionary, DictionaryValue, beginCell, contractAddress, fromNano, toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { SafeTON } from '../wrappers/SafeTON';

const CONTRACT_ADDRESS: string = 'kQDq0Q8rPu373WgFitCzU89yzLjnXuN3i9TrQ7s_8D8iyBLM';

export async function run(provider: NetworkProvider) {
    const nft_content = beginCell().storeStringTail('item.json').endCell();

    const cell = beginCell().storeAddress(provider.sender().address).storeRef(nft_content).endCell();

    const msg_body = beginCell()
        .storeUint(1, 32)
        .storeUint(0, 64)
        .storeUint(1, 64) // item index
        .storeCoins(toNano('0.1')) // forward amount
        .storeRef(cell)
        .endCell();
    const tons_to_mint = toNano('0.2');

    const nft_collection_contract = provider.open(SafeTON.createFromAddress(Address.parse(CONTRACT_ADDRESS)));

    await nft_collection_contract.sendMintRequest(provider.sender(), tons_to_mint, 1, 0.1, nft_content);
}