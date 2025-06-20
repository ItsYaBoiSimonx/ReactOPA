#!/bin/bash

for port in 3000 9000; do
    pids=$(lsof -ti tcp:$port)
    if [ -n "$pids" ]; then
        echo "Killing processes on port $port: $pids"
        kill -9 $pids
    fi
done