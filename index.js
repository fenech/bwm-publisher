const mqtt = require("mqtt");
const { spawn } = require("child_process");

const config = {
    hostname: process.env.BROKER_HOSTNAME || "message-broker",
    username: process.env.BROKER_USERNAME || null,
    password: process.env.BROKER_PASSWORD || null,
    iface: process.env.IFACE,
    sensorsTopic: process.env.SENSOR_TOPIC || "sensordata"
};

const options = {
    username: config.username,
    password: config.password
};

const client = mqtt.connect(
    `mqtt://${config.hostname}`,
    options
);

const bwm = spawn("./bwm-ng", ["-I", config.iface, "-o", "csv", "-T", "rate", "-u", "bits"]);

bwm.stdout.on("data", data => {
    const line = data.toString();

    if (/total/.test(line)) return;

    const parts = line.split(";");

    if (parts.length < 5) {
        console.warn("failed to parse line", line);
    }

    // unix_timestamp;iface_name;bytes_out;bytes_in;bytes_total;packets_out;packets_in;packets_total;errors_out;errors_in
    const [timestamp, iface, bitsIn, bitsOut, bandwidth] = parts;
    const message = {
        timestamp: +timestamp * 1000,
        iface,
        bitsIn: +bitsIn,
        bitsOut: +bitsOut,
        bandwidth: +bandwidth
    };

    console.debug(message);
    client.publish(config.sensorsTopic, JSON.stringify(message));
});

process.on('SIGINT', () => {
    process.exit();
});
