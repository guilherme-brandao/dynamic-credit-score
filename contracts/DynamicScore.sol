// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

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

    constructor() ERC721("DynamicScore", "DSC") {}

    // This function is used to update the metadata for a specific NFT.
    function updateUserNFT(
        uint256 userId,
        uint256 score,
        bool enthusiast,
        bool blueship
    ) public {
        // Update the metadata and emit the event.
        users[userId].score = score;
        users[userId].enthusiast = enthusiast;
        users[userId].blueship = blueship;

        emit MetadataUpdated(userId);
    }

    function createUserNFT() public {
        uint256 newUserId = users.length;

        // Initial stats
        uint256 score = 0;
        bool enthusiast = false;
        bool blueship = false;

        users.push(User(score, enthusiast, blueship));

        _safeMint(msg.sender, newUserId);
        emit NftReturned(newUserId);
    }
}
