#!/bin/bash
echo "Enter the port number: ";read PORT

echo "1. Wallet-info"
echo "2. Transact"
echo "3. Transaction-Pool"
echo "4. Blocks"
echo "5. Mine-transactions"
echo "6. Change port"
echo "7. Exit"
echo -n "> "

while :
do
read choice
case $choice in
    1)  curl http://localhost:$PORT/api/wallet-info | jq
        echo "";;
    2)  echo "Enter receiver: "
        read RECEIVER
        echo "Enter amount: "
        read AMOUNT
        curl -X POST -H "Content-Type: application/json" -d '{"receiver": "'"$RECEIVER"'" , "amount":'"$AMOUNT"'}' http://localhost:$PORT/api/transact | jq
        echo "";;
    3)  curl http://localhost:$PORT/api/transaction-pool-map | jq
        echo "";;
    4)  curl http://localhost:$PORT/api/blocks | jq
        echo "";;
    5)  echo "Starting to mine..."
        curl http://localhost:$PORT/api/mine-transactions
        echo ""
        echo "Done."
        curl http://localhost:$PORT/api/blocks | jq
        echo "";;

    6)  echo "Enter the port number: " ;read PORT
        echo "";;
    7)  echo "Exiting..."
        exit;;
    *)  echo "Invalid option"
    
esac
    echo -n "> "
done
