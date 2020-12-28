import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Transaction from './Transaction';

class Block extends Component {

  state = { displayTransaction: false };

  toggleTransaction = () => {
    this.setState({ displayTransaction: !this.state.displayTransaction });
  }

  get displayTransaction() {
    const { data } = this.props.block;
    const stringifiedData = JSON.stringify(data);
    const dataDisplay = stringifiedData.length > 35 ? `${stringifiedData.substring(0, 35)}...` : stringifiedData;

    if(this.state.displayTransaction) {
      return (
        <div>
          {
            data.map(transaction =>
              <div key={transaction.id}>
                <Transaction transaction={transaction} />
              </div>
            )
          }
          <Button
            size='sm'
            onClick={this.toggleTransaction}
          >Show less</Button>
        </div>
      );
    }

    return (
      <div>
        <p>Data: {dataDisplay}</p>
        <Button
          variant='info'
          size='sm'
          onClick={this.toggleTransaction}
        >Show more</Button>
      </div>
    );
  }

  render () {
    const { timestamp, hash } = this.props.block;
    const hashDisplay = `${hash.substring(0, 15)}...`;

    return (
      <div className='Block'>
        <p>Hash: {hashDisplay}</p>
        <p>Timestamp: {new Date(timestamp).toLocaleString()}</p>
        {this.displayTransaction}
      </div>
    );
  }
}

export default Block;
