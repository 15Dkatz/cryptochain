import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Block from './Block';
import { blockchainAPI } from '../../services';
import io from 'socket.io-client';

class Blocks extends Component {

  state = { blocks: [], paginatedId: 1, blocksLength: 0 }

  #fetchLength = () => {
    return blockchainAPI.fetchBlockchainLength()
    .then(json => this.setState({ blocksLength: json }))
  }

  #fetchBlockchain = id => {
    return blockchainAPI.fetchPaginatedBlocks(id)
    .then(json => this.setState({ blocks: json }))
  }

  #fetchInfo = () => {
    this.#fetchLength()
    .catch(err => alert(err.message));
    this.#fetchBlockchain(this.state.paginatedId)
    .catch(err => alert(err.message));
  }

  componentDidMount() {
      this.socket = io();
      this.socket.on('blocks', () => {
        this.#fetchInfo();
      });
      this.#fetchInfo();
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
              <span key={key} onClick={() => {
                this.setState({ paginatedId: id }, () => this.#fetchInfo());                
              } }>
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
