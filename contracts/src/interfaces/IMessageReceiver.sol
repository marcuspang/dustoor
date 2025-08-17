// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

interface IMessageTransmitter {
    function receiveMessage(
        bytes calldata message,
        bytes calldata attestation
    ) external returns (bool success);

    function sendMessage(
        uint32 destinationDomain,
        bytes32 recipient,
        bytes32 destinationCaller,
        uint32 minFinalityThreshold,
        bytes calldata messageBody
    ) external returns (uint64 nonce);

    function localDomain() external view returns (uint32);
}