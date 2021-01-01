import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Block from './Block';
import { blockchainAPI } from '../../services';
import io from 'socket.io-client';

class Blocks extends Component {

  state = { blocks: [], paginatedId: 1, blocksLength: 0 }

  #fetchLength = () => {
    blockchainAPI.fetchBlockchainLength()
    .then(json => this.setState({ blocksLength: json }));
  }

  #fetchBlockchain = id => {
    blockchainAPI.fetchPaginatedBlocks(id)
    .then(json => this.setState({ blocks: json }));
  }

  #fetchInfo = id => {
    this.#fetchLength();
    this.#fetchBlockchain(id);
  }

  componentDidMount() {
      this.socket = io();
      this.socket.on('sync', () => {
        this.#fetchInfo(this.state.paginatedId);
      });
      this.#fetchInfo(this.state.paginatedId);
  }

  componentWillUnmount() {
    this.socket.close();
  }

  render() {
    return(
      <div className='Blocks'>
        <h3>Blocks</h3>
        <div>
        {
          [...Array(Math.ceil(this.state.blocksLength/5)).keys()].map(key => {
            const id = key + 1;
            return (
              <span key={key} onClick={() => this.#fetchInfo(id) }>
                <Button
                  variant='info'
                  size='sm'
                >{id}</Button>{' '}
              </span>
            )
          })
        }
        </div>
        {
          this.state.blocks.map(block => <Block key={block.hash} block={block} />)
        }
      </div>
    );
  }
}

export default Blocks;
