// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ArtistNFT is ERC721URIStorage, ERC721Enumerable,ERC721Royalty, Ownable{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint96 royaltyFraction = 200;
    uint public feeRate = 1 gwei;
    address public feeCollector;
    function setFeeRoyaltyFraction(uint96 rf)external onlyOwner {
        royaltyFraction = rf;
    }
    function setFeeRate(uint fr)external onlyOwner {
        feeRate = fr;
    }
    function setFeeCollector(address fc)external onlyOwner{
        feeCollector = fc;
    }
    constructor() ERC721("ArtistNFT", "AN") {
       feeCollector = owner();
    }
    function withdraw()external {
        require(msg.sender == feeCollector, "only fee collector can withdraw");
        (bool suc, bytes memory data) = feeCollector.call{value:address(this).balance}("");
        require(suc, "withdraw failed!");

    }
    function mint(address artist, string memory tokenURI)
        public
        payable
        returns (uint256)
    {
        require(msg.value > feeRate, "please provide 1g wei for your minting!");
  
        uint256 newItemId = _tokenIds.current();
        _mint(artist, newItemId);
        _setTokenURI(newItemId, tokenURI);

        _tokenIds.increment();
        _setTokenRoyalty(newItemId, artist, royaltyFraction);
        return newItemId;
    }
    

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, firstTokenId,batchSize);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage, ERC721Royalty)
    {
        super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable,ERC721Royalty)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return ERC721URIStorage.tokenURI(tokenId);
    }
}
