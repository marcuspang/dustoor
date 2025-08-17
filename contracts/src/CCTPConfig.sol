// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

/**
 * @title CCTPConfig
 * @notice Configuration contract for Circle CCTP v2 testnet addresses and domain mappings
 */
contract CCTPConfig {
    // CCTP v2 Testnet Contract Addresses (same across all chains)
    address public constant TOKEN_MESSENGER_V2 = 0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA;
    address public constant MESSAGE_TRANSMITTER_V2 = 0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275;
    address public constant TOKEN_MINTER_V2 = 0xb43db544E2c27092c107639Ad201b3dEfAbcF192;
    
    // CCTP Domain IDs for supported testnet chains
    uint32 public constant ETHEREUM_SEPOLIA_DOMAIN = 0;
    uint32 public constant AVALANCHE_FUJI_DOMAIN = 1;
    uint32 public constant OP_SEPOLIA_DOMAIN = 2;
    uint32 public constant ARBITRUM_SEPOLIA_DOMAIN = 3;
    uint32 public constant BASE_SEPOLIA_DOMAIN = 6;
    uint32 public constant POLYGON_AMOY_DOMAIN = 7;
    uint32 public constant UNICHAIN_SEPOLIA_DOMAIN = 10;
    uint32 public constant LINEA_SEPOLIA_DOMAIN = 11;
    uint32 public constant CODEX_TESTNET_DOMAIN = 12;
    uint32 public constant SONIC_TESTNET_DOMAIN = 13;
    uint32 public constant WORLD_CHAIN_SEPOLIA_DOMAIN = 14;
    uint32 public constant SEI_TESTNET_DOMAIN = 16;
    
    // LayerZero EID to CCTP Domain mapping
    mapping(uint32 => uint32) public layerZeroToCCTPDomain;
    
    constructor() {
        // Initialize LayerZero EID to CCTP Domain mappings
        // Note: These LayerZero EIDs are examples and should be updated with actual values
        layerZeroToCCTPDomain[40161] = ETHEREUM_SEPOLIA_DOMAIN;    // Ethereum Sepolia
        layerZeroToCCTPDomain[40106] = AVALANCHE_FUJI_DOMAIN;     // Avalanche Fuji
        layerZeroToCCTPDomain[40232] = OP_SEPOLIA_DOMAIN;         // OP Sepolia
        layerZeroToCCTPDomain[40231] = ARBITRUM_SEPOLIA_DOMAIN;   // Arbitrum Sepolia
        layerZeroToCCTPDomain[40245] = BASE_SEPOLIA_DOMAIN;       // Base Sepolia
        layerZeroToCCTPDomain[40267] = POLYGON_AMOY_DOMAIN;       // Polygon Amoy
        layerZeroToCCTPDomain[40302] = UNICHAIN_SEPOLIA_DOMAIN;   // Unichain Sepolia
        layerZeroToCCTPDomain[40287] = LINEA_SEPOLIA_DOMAIN;      // Linea Sepolia
        layerZeroToCCTPDomain[40300] = CODEX_TESTNET_DOMAIN;      // Codex Testnet
        layerZeroToCCTPDomain[40301] = SONIC_TESTNET_DOMAIN;      // Sonic Testnet
        layerZeroToCCTPDomain[40303] = WORLD_CHAIN_SEPOLIA_DOMAIN; // World Chain Sepolia
        layerZeroToCCTPDomain[40304] = SEI_TESTNET_DOMAIN;        // Sei Testnet
    }
    
    /**
     * @notice Get CCTP domain for a LayerZero endpoint ID
     * @param layerZeroEid LayerZero endpoint ID
     * @return CCTP domain ID
     */
    function getCCTPDomain(uint32 layerZeroEid) external view returns (uint32) {
        return layerZeroToCCTPDomain[layerZeroEid];
    }
    
    /**
     * @notice Check if a LayerZero endpoint ID is supported
     * @param layerZeroEid LayerZero endpoint ID
     * @return True if supported
     */
    function isChainSupported(uint32 layerZeroEid) external view returns (bool) {
        // Special case for Ethereum Sepolia which has domain 0
        if (layerZeroEid == 40161) return true; // Ethereum Sepolia
        return layerZeroToCCTPDomain[layerZeroEid] != 0;
    }
    
    /**
     * @notice Get the current chain's CCTP domain based on chain ID
     * @return CCTP domain ID for current chain
     */
    function getCurrentDomain() external view returns (uint32) {
        uint256 chainId = block.chainid;
        
        if (chainId == 11155111) return ETHEREUM_SEPOLIA_DOMAIN;    // Ethereum Sepolia
        if (chainId == 43113) return AVALANCHE_FUJI_DOMAIN;        // Avalanche Fuji
        if (chainId == 11155420) return OP_SEPOLIA_DOMAIN;         // OP Sepolia
        if (chainId == 421614) return ARBITRUM_SEPOLIA_DOMAIN;     // Arbitrum Sepolia
        if (chainId == 84532) return BASE_SEPOLIA_DOMAIN;          // Base Sepolia
        if (chainId == 80002) return POLYGON_AMOY_DOMAIN;          // Polygon Amoy
        if (chainId == 1301) return UNICHAIN_SEPOLIA_DOMAIN;       // Unichain Sepolia
        if (chainId == 59141) return LINEA_SEPOLIA_DOMAIN;         // Linea Sepolia
        if (chainId == 325000) return CODEX_TESTNET_DOMAIN;        // Codex Testnet
        if (chainId == 64165) return SONIC_TESTNET_DOMAIN;         // Sonic Testnet
        if (chainId == 4801) return WORLD_CHAIN_SEPOLIA_DOMAIN;    // World Chain Sepolia
        if (chainId == 713715) return SEI_TESTNET_DOMAIN;          // Sei Testnet
        
        revert("Unsupported chain");
    }
}