import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { SafeTON } from '../wrappers/SafeTON';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('SafeTON', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('SafeTON');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let safeTON: SandboxContract<SafeTON>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        safeTON = blockchain.openContract(SafeTON.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await safeTON.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: safeTON.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and safeTON are ready to use
        const wallet = await blockchain.treasury('wallet');
        const result = await safeTON.sendTransaction(wallet.getSender(), toNano('1'));

        expect(result.transactions).toHaveTransaction({
            from: wallet.address,
            to: safeTON.address,
            success: true,
    });
});
});
