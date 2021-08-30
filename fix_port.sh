#!/bin/bash
# bash script to kill port 3000 before running instance
# found this to be useful in many cases
kill $(lsof -t -i:3000)