// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyProxy{
    address immutable implementation;
    constructor(address imp){
        implementation = imp;//实际发生的事情是对implementation在runtimecode中的占位符进行替换
    }

    fallback()external{
        address impl = implementation; 
        assembly {
            // calldatacopy(t, f, s)
            // copy s bytes from calldata at position f to mem at position t
            calldatacopy(0, 0, calldatasize())

            // delegatecall(g, a, in, insize, out, outsize)
            // - call contract at address a
            // - with input mem[in…(in+insize))
            // - providing g gas
            // - and output area mem[out…(out+outsize))
            // - returning 0 on error and 1 on success
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)

            // returndatacopy(t, f, s)
            // copy s bytes from returndata at position f to mem at position t
            returndatacopy(0, 0, returndatasize())

            switch result
            case 0 {
                // revert(p, s)
                // end execution, revert state changes, return data mem[p…(p+s))
                revert(0, returndatasize())
            }
            default {
                // return(p, s)
                // end execution, return data mem[p…(p+s))
                return(0, returndatasize())
            }
    }
    }
}