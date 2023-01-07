// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

contract DynamicScore is ERC721URIStorage {
    struct User {
        uint256 score;
        bool enthusiast;
        bool blueship;
    }

    User[] public users;

    mapping(address => uint256) public userIndex;

    // This event is emitted when the metadata for an NFT is updated.
    event MetadataUpdated(uint256 indexed tokenId);
    event NftReturned(uint256 indexed NFTId);

    constructor() ERC721("DynamicScore", "DSC") {
        console.log("Deploying DynamicScore NFT Contract!"); 
    }

    // This function is used to update the metadata for a specific NFT.
    function updateUserNFT(
        address userId,
        uint256 score,
        bool enthusiast,
        bool blueship
    ) public {
        // Update the metadata and emit the event.

        users[userIndex[userId]].score = score;
        users[userIndex[userId]].enthusiast = enthusiast;
        users[userIndex[userId]].blueship = blueship;

        emit MetadataUpdated(userIndex[userId]);
    }

    function createUserNFT() public {
        require(userIndex[msg.sender] > 0, "User already has an NFT");
        uint256 newUserId = users.length;

        // Initial stats
        uint256 score = 0;
        bool enthusiast = false;
        bool blueship = false;

        users.push(User(score, enthusiast, blueship));

        _safeMint(msg.sender, newUserId);
        userIndex[msg.sender] = newUserId;
        emit NftReturned(newUserId);
    }

    function getUser(uint256 index) public view returns (User memory) {
        return users[index];
    }
}
