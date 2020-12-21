import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Block from './Block';
import io from 'socket.io-client';

class Blocks extends Component {
  state = { blocks: [], paginetedId: 1, blocksLength: 0 };

  fetchBlockchain = () => {
    fetch(`${document.location.origin}/api/blocks/length`)
      .then(res => res.json())
      .then(json => this.setState({ blocksLength: json }));
    this.fetchPaginatedBlocks(this.state.paginetedId)();
  }

  fetchPaginatedBlocks = id => () => {
    fetch(`${document.location.origin}/api/blocks/${id}`)
      .then(res => res.json())
      .then(json => this.setState({ blocks: json }));
  }

  componentDidMount() {
    this.socket = io();
    this.socket.on('sync', () => {
      this.fetchBlockchain();
    });
    this.fetchBlockchain();
  }

  render() {
    return (
      <div>
        <div><Link to='/'>Home</Link></div>
        <h3>Blocks</h3>
        <div>
          {
            [...Array(Math.ceil(this.state.blocksLength/5)).keys()].map(key => {
              const paginetedId = key+1;
              return (
                <span key={key} onClick={this.fetchPaginatedBlocks(paginetedId)}>
                  <Button
                    variant='info'
                    size='sm'
                  >{paginetedId}</Button>{' '}
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
