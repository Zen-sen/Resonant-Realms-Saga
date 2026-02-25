warning: in the working copy of 'contracts/libraries/LibDiamond.sol', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/contracts/libraries/LibDiamond.sol b/contracts/libraries/LibDiamond.sol[m
[1mindex 8a8d99e..1e52f49 100644[m
[1m--- a/contracts/libraries/LibDiamond.sol[m
[1m+++ b/contracts/libraries/LibDiamond.sol[m
[36m@@ -33,6 +33,18 @@[m [mlibrary LibDiamond {[m
         ds.contractOwner = _newOwner;[m
     }[m
 [m
[32m+[m[32m    /**[m
[32m+[m[32m     * @notice The Architect's Seal - Ownership Enforcement[m
[32m+[m[32m     * @dev Reverts if msg.sender is not the contract owner[m
[32m+[m[32m     * @custom:security CRITICAL - Must be called at the start of diamondCut[m
[32m+[m[32m     */[m
[32m+[m[32m    function enforceIsContractOwner() internal view {[m
[32m+[m[32m        require([m
[32m+[m[32m            msg.sender == diamondStorage().contractOwner,[m[41m [m
[32m+[m[32m            "LibDiamond: Must be contract owner"[m
[32m+[m[32m        );[m
[32m+[m[32m    }[m
[32m+[m
     function diamondCut([m
         IDiamondCut.FacetCut[] memory _diamondCut,[m
         address _init,[m
[36m@@ -63,4 +75,4 @@[m [mlibrary LibDiamond {[m
             selectorPosition++;[m
         }[m
     }[m
[31m-}[m
\ No newline at end of file[m
[32m+[m[32m}[m
