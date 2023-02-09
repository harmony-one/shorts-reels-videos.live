interface MetaMaskNetworkConfig {
    chainId: string;
    chainName: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    rpcUrls: string[];
    blockExplorerUrls: string[];
}

export const numberToHex = (value: number): string => {
    return '0x' + value.toString(16);
};

const BinanceConfig: MetaMaskNetworkConfig = {
    chainId: numberToHex(parseInt(process.env.METAMASK_BSC_CHAIN_ID, 10)),
    chainName: process.env.METAMASK_BSC_CHAIN_NAME,
    nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
    },
    rpcUrls: [process.env.METAMASK_BSC_RPC_URL],
    blockExplorerUrls: [process.env.METAMASK_BSC_EXPLORER],
};

const HarmonyConfig: MetaMaskNetworkConfig = {
    chainId: numberToHex(parseInt(process.env.METAMASK_HMY_CHAIN_ID, 10)),
    chainName: process.env.METAMASK_BSC_CHAIN_NAME,
    nativeCurrency: {
        name: 'ONE',
        symbol: 'ONE',
        decimals: 18,
    },
    rpcUrls: [process.env.METAMASK_HMY_RPC_URL],
    blockExplorerUrls: [process.env.HMY_EXPLORER_URL],
};

const EthereumConfig: MetaMaskNetworkConfig = {
    chainId: numberToHex(parseInt(process.env.METAMASK_ETH_CHAIN_ID, 10)),
    chainName: process.env.METAMASK_ETH_CHAIN_NAME,
    nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
    },
    rpcUrls: [process.env.METAMASK_ETH_RPC_URL],
    blockExplorerUrls: [process.env.ETH_EXPLORER_URL],
};

export const chainNameMap = {
    '1': 'Ethereum: mainnet',
    '56': 'Binance: mainnet',
    '1666600000': 'Harmony: mainnet',
    '42': 'Ethereum: kovan',
    '97': 'Binance: testnet',
    '1666700000': 'Harmony: testnet',
};

export const getChainName = (chainId: number): string => {
    return chainNameMap[chainId];
};

export const getChainConfig = () => {
    return HarmonyConfig;
};