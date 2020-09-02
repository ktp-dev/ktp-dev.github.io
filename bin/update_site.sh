#!/bin/bash

# Script for updating ktp website after a new commit

set -Eeuo pipefail
set -x

ssh root@204.48.19.80 << EOF
	set -x
	cd website
	cd static
	git pull
	cd ..
	sudo docker-compose up -d --no-deps --build ktp_app
	exit
EOF

