// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.22;

// import {ILayerZeroEndpointV2} from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpointV2.sol";
// import {
//     MessagingFee,
//     MessagingReceipt
// } from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpointV2.sol";
// import {Origin} from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
// import {MessagingParams} from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpointV2.sol";
// import {SetConfigParam} from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/IMessageLib.sol";

// contract MockLayerZeroEndpoint is ILayerZeroEndpointV2 {
//     mapping(address => mapping(uint32 => bytes32)) public peers;
//     uint32 public eid = 1;
//     address public delegate;

//     struct QueuedPacket {
//         uint32 dstEid;
//         bytes32 receiver;
//         bytes message;
//         address sender;
//     }

//     QueuedPacket[] public queuedPackets;

//     function send(MessagingParams calldata _params, address _refundAddress)
//         external
//         payable
//         override
//         returns (MessagingReceipt memory)
//     {
//         queuedPackets.push(
//             QueuedPacket({
//                 dstEid: _params.dstEid,
//                 receiver: _params.receiver,
//                 message: _params.message,
//                 sender: msg.sender
//             })
//         );

//         return MessagingReceipt({guid: bytes32(0), nonce: 1, fee: MessagingFee(msg.value, 0)});
//     }

//     function quote(MessagingParams calldata _params, address _sender)
//         external
//         view
//         override
//         returns (MessagingFee memory)
//     {
//         return MessagingFee(0.01 ether, 0);
//     }

//     function verify(Origin calldata _origin, address _receiver, bytes32 _payloadHash) external override {}

//     function verifiable(Origin calldata _origin, address _receiver) external view override returns (bool) {
//         return true;
//     }

//     function initializable(Origin calldata _origin, address _receiver) external view override returns (bool) {
//         return true;
//     }

//     function lzReceive(
//         Origin calldata _origin,
//         address _receiver,
//         bytes32 _guid,
//         bytes calldata _message,
//         bytes calldata _extraData
//     ) external payable override {
//         // Mock implementation - would call the OApp's lzReceive
//     }

//     function clear(address _oapp, Origin calldata _origin, bytes32 _guid, bytes calldata _message) external override {}

//     function setConfig(address _oapp, address _lib, SetConfigParam[] calldata _params) external override {}

//     function getConfig(address _oapp, address _lib, uint32 _eid, uint32 _configType)
//         external
//         view
//         override
//         returns (bytes memory)
//     {
//         return "";
//     }

//     function isDefaultSendLibrary(address _sender, uint32 _dstEid) external view override returns (bool) {
//         return true;
//     }

//     function defaultSendLibrary(uint32 _dstEid) external view override returns (address) {
//         return address(this);
//     }

//     function defaultReceiveLibrary(uint32 _srcEid) external view override returns (address) {
//         return address(this);
//     }

//     function isDefaultReceiveLibrary(address _receiver, uint32 _srcEid) external view returns (bool) {
//         return true;
//     }

//     function setSendLibrary(address _oapp, uint32 _dstEid, address _newLib) external override {}

//     function getSendLibrary(address _sender, uint32 _dstEid) external view override returns (address) {
//         return address(this);
//     }

//     function setReceiveLibrary(address _oapp, uint32 _srcEid, address _newLib) external override {}

//     function getReceiveLibrary(address _receiver, uint32 _srcEid) external view override returns (address) {
//         return address(this);
//     }

//     function setDelegate(address _oapp) external override {
//         delegate = _oapp;
//     }

//     // Helper function to simulate receiving a message
//     function simulateReceive(uint32 srcEid, address receiver, bytes calldata message) external {
//         Origin memory origin = Origin({srcEid: srcEid, sender: bytes32(uint256(uint160(msg.sender))), nonce: 1});

//         // Call the receiver's lzReceive function
//         (bool success,) = receiver.call(
//             abi.encodeWithSignature(
//                 "_lzReceive(Origin,bytes32,bytes,address,bytes)", origin, bytes32(0), message, address(this), ""
//             )
//         );
//         require(success, "lzReceive failed");
//     }

//     function getLastQueuedPacket() external view returns (QueuedPacket memory) {
//         require(queuedPackets.length > 0, "No packets queued");
//         return queuedPackets[queuedPackets.length - 1];
//     }
// }
