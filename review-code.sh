#!/bin/bash
echo "=== Sending to Kimi for review ==="
echo "Go to: https://kimi.com"
echo ""
echo "Prompt to paste:"
echo "---"
echo "Review this Solidity Diamond Pattern code for:"
echo "- Security vulnerabilities"
echo "- Gas optimization opportunities"
echo "- Best practices violations"
echo ""
echo "Code changes:"
cat changes.txt
echo "---"
