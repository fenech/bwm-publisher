# BWM publisher

Publish network stats to an message queue

## Config

`BROKER_HOSTNAME`
`BROKER_USERNAME` (default null)
`BROKER_PASSWORD` (default null)
`IFACE`: name of network interface
`SENSOR_TOPIC`: message queue topic

## Build

`docker build -t bwm-publisher .`

## Run

    docker run \
    	--network host \
    	-e BROKER_HOSTNAME=broker.domain \
    	-e IFACE=wlp2s0 \
    	--cap-add=NET_ADMIN \
    	bwm-publisher
