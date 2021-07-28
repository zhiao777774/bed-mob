/*
// ethjs wrap
import Eth from 'ethjs';

const web3 = (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') ?
    new Eth(window.web3.currentProvider) :
    new Eth(new Eth.HttpProvider('http://localhost:7545'));

export { web3 };
*/

// web3js wrap
import Web3 from 'web3';

const infuraKey = '3a545e2e7a254b29bcba14031dfdae81';
const web3 = (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') ?
    new Web3(window.ethereum) :
    new Web3(new Web3.providers.HttpProvider(`https://rinkeby.infura.io/v3/${infuraKey}`));

export { web3 };