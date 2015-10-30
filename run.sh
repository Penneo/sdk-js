#!/bin/bash
docker run -it -w '/app' -v `pwd`:/app penneo/nodejs:1.0.0  /bin/bash
